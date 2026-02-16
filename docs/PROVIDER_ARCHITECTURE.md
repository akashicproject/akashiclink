# Architecture Overview

This document focuses on the browser extension provider integration path (background/content/injected + website usage layer). It intentionally does NOT describe any backend/off-chain services.

## Components

| Component            | Location                                                          | Purpose                                                                            |
| -------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Wallet Context       | `packages/ui-lib/src/connect-wallet/providers/wallet-context.tsx` | React context wrapper that finds the correct provider for the expected environment |
| Extension Background | `apps/wallet-extension/src/background.ts`                         | Core state machine, approvals, sessions, RPC handling (MV3 service worker)         |
| Content Script       | `apps/wallet-extension/src/content.ts`                            | Bridge between page and extension worlds; injects provider script, relays messages |
| Injected Script      | `apps/wallet-extension/src/injected.ts`                           | Lives in the page JS context; exposes EIP-1193-like provider into the registry     |
| Manifest / Build     | `apps/wallet-extension/public/manifest.json` + Vite config        | Defines MV3 permissions, loads scripts                                             |

## High-Level Data Flow

```
+-----------------+        postMessage (window)        +-----------------+    chrome.runtime API    +------------------+
|  Injected Page  | <-------------------------------> |  Content Script | <----------------------> |  Background SW    |
|  (injected.ts)  |                                   | (content.ts)    |                          | (background.ts)   |
+-----------------+                                   +-----------------+                          +------------------+
       ^                                                                                            ^
       | registry lookup                                                                             |
       |                                                                                             |
+--------------------+                                                                               |
| Website (React App)|  uses window.__AKASHIC_PROVIDERS[env]                                    |
+--------------------+                                                                               |
```

## Environment Separation

Multiple extension builds (e.g. `prod`, `staging`, `dev`) can co-exist. Each build sets `EXT_ENV` at compile time. The injected script registers its provider at:

```
window.__AKASHIC_PROVIDERS[EXT_ENV] = provider
```

The website selects a provider by environment:

```
const expected = process.env.NEXT_PUBLIC_AKASHIC_ENV || 'dev';
const provider = window.__AKASHIC_PROVIDERS?.[expected];
```

No global `window.akashicLink` fallback is used, preventing collisions.

## Initialization Sequence

1. Content script loads on allowed origins (filtered by `EXT_ENV`).
2. Content script injects `injected.js` into the page.
3. Injected script attaches event listeners then posts `{ [CHANNEL]: 'injected_ready' }`.
4. Content script receives it and sends a Chrome runtime message `{ [CHANNEL]: 'init_request' }` to background.
5. Background responds `{ [CHANNEL]: 'init_response', token, version, chainId, env }`.
6. Content script forwards as a window `postMessage` `{ [CHANNEL]: 'init', ... }` to the injected script.
7. Injected script marks provider as connected (emits `connect`).
8. Provider is now available in the registry; React app can call `provider.request`.

## RPC Request Flow (Example: eth_requestAccounts)

```
Website React -> provider.request({ method: 'eth_requestAccounts' })
   Injected: wraps call, assigns id, posts window message { [CHANNEL]: 'request' }
      Content: hears request, sends chrome.runtime message { [CHANNEL]: 'rpc_request' }
         Background: stores PendingRequest, opens approval popup (unless origin already granted)
         User Approves -> background responds with accounts -> content forwards rpc_response -> injected matches id -> resolves promise
```

## Events Flow

Background emits events via `chrome.tabs.sendMessage` with shape:

```
{ [CHANNEL]: 'provider_event', token, seq, event, args }
```

Content relays to page as window `postMessage` with the same shape. Injected script validates minimal ordering (`seq` strictly increasing) and calls registered listeners.

Current events:

- `accountsChanged` `[string[]]`
- `disconnect` `[{ code, message }]`
- `popupOpened` `{ requestId, windowId, method }`
- `popupClosed` `{ requestId, reason|resolution }`

## Approval & Popups

For methods requiring user consent (`eth_requestAccounts`, `eth_sendTransaction`, `eth_signTypedData_v4`, `wallet_lockWallet`):

1. Background creates a PendingRequest and opens a popup window referencing `index.html` with query params.
2. Popup UI posts an `approval_decision` message back to background.
3. Background resolves or rejects RPC and notifies page of popupClosed.
4. Timeout (120s) auto-rejects with `ERR_REJECTED` if no decision.

## Session & Permissions

- Sessions keyed by tabId: `{ accounts, origin }`.
- First approval for `eth_requestAccounts` stores granted origin -> accounts list in `originPermissions`.
- Subsequent `eth_requestAccounts` for same origin auto-approve (no popup).
- Origin change (navigation to different host) triggers forced disconnect.

## Storage & Persistence

- Lightweight state persisted in `chrome.storage.local` under `AKASHIC_STATE_V1`.
- On background worker restart, sessions are restored only if the tab still matches original origin.

## Error Codes

| Code | Symbol           | Meaning                                |
| ---- | ---------------- | -------------------------------------- |
| 4001 | ERR_REJECTED     | User rejected / cancelled              |
| 4100 | ERR_UNAUTHORIZED | Request requires an authorized session |
| 4200 | ERR_UNSUPPORTED  | Method not implemented                 |
| 4201 | ERR_PENDING      | Another approval pending               |
| 4900 | ERR_DISCONNECTED | Session disconnected                   |

## Provider API (EIP-1193-ish subset)

Supported methods:

- `eth_requestAccounts`
- `eth_chainId`
- `eth_sendTransaction`
- `eth_signTypedData_v4`
- `wallet_closeApproval(requestId)` (custom)
- `wallet_disconnect`
- `wallet_lockWallet`

## Security Notes / Limitations

- The injected provider runs in the page context; any page script can call it (expected for wallets embedding providers).
- `EVENT_TOKEN` currently offers minimal authenticity (page code can read and replay). Future hardening could move logic to content script or introduce isolated world proxying.
- Sequence numbers (`seq`) mitigate reordering but not malicious forging.
- Allowed origins are environment-scoped; production build does not inject on staging domains.

## Multi-Environment Strategy

- Each build uses a distinct `CHANNEL` name: `__akashicLink_${EXT_ENV}` to separate message domains.
- Providers are namespaced only via registry key `__AKASHIC_PROVIDERS[env]`.
- The website selects exactly one env; missing provider yields connection error.

## Adding a New RPC Method

1. Update `background.ts` switch in `rpc_request` handler.
2. Decide: auto-approve or require popup? If popup needed, add a view in extension UI.
3. Relay result or error via `respond()`.
4. (Optional) Add event emissions if stateful.
5. Update docs & types if the method is public.

## Future Hardening Ideas

- Move more logic into content script; injected script becomes a thin proxy.
- Per-request auth tag using tabSecret (currently generated but not leveraged).
- Granular permission model (scopes per origin).
- Event subscription filtering to reduce noise.

---

For a concise on-page summary see the Architecture section in the root README.
