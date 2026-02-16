/* eslint-disable @typescript-eslint/no-explicit-any */
// -----------------------------
// Types & Constants
// -----------------------------

import { onMessage, sendMessage } from 'webext-bridge/background';

import {
  BRIDGE_MESSAGE,
  type BridgeMessageProtocolMap,
} from './types/bridge-types';
import {
  AKASHIC_METHOD,
  ERR_DISCONNECTED,
  ERR_PENDING,
  ERR_REJECTED,
  ERR_UNAUTHORIZED,
  ERR_UNSUPPORTED,
  EXT_ENV,
  EXT_VERSION,
  type IAccountsReturnType,
  type IRequestAccountsReturnType,
  type ISignTypedDataReturnType,
  PROVIDER_EVENT,
  WALLET_METHOD,
} from './types/provider-types';
import { APP_AUTO_LOCK_BY } from './utils/preference-keys';

// Popup timeout (ms)
// Consider making this configurable or adjusting for better UX.
// 60 seconds is a common default for user approvals.
const POPUP_TIMEOUT_MS = 60_000;
const popupTimers: Record<number, number> = {};

// -----------------------------
// Core State
// -----------------------------

interface PendingRequest {
  id: number;
  method: string;
  origin?: string;
  siteTitle?: string;
  params?: any[];
  tabId: number;
  popupWindowId?: number;
}
interface SessionInfo {
  origin: string;
}

type RpcSuccess = {
  id: number;
  result:
    | IAccountsReturnType
    | IRequestAccountsReturnType
    | ISignTypedDataReturnType
    | boolean;
};
type RpcError = {
  id: number;
  error: { code: number; message: string };
};

// Active requests by id which is initially set after RPC request is received
// and cleared after user approval/rejection or timeout
const pendingRequest: Record<number, PendingRequest> = {};
// Active sessions by tabId which is initially set after accounts are approved
// and cleared on disconnect, tab close, or unauthorized request
const sessions: Record<number, SessionInfo> = {};
// Persisted granted permissions by origin
const originPermissions: Record<string, string[]> = {};

// Persistence (single root key only)
const ROOT_KEY = 'AKASHIC_STATE_V1';
let persistTimer: number | null = null;
const PERSIST_DEBOUNCE_MS = 500;

function schedulePersist() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      const serialSessions: Record<string, SessionInfo> = {};
      for (const [k, v] of Object.entries(sessions)) serialSessions[k] = v;
      const serialRequests: Record<string, PendingRequest> = {};
      for (const [k, v] of Object.entries(pendingRequest)) {
        serialRequests[k] = v;
      }
      chrome.storage.local.set({
        [ROOT_KEY]: {
          sessions: serialSessions,
          originPermissions,
          pendingRequests: serialRequests,
        },
      });
    } catch (e) {
      log('persist failed', e);
    }
  }, PERSIST_DEBOUNCE_MS) as unknown as number;
}

function restoreState() {
  try {
    chrome.storage.local.get(ROOT_KEY, (items) => {
      try {
        const container = items[ROOT_KEY];
        if (!container) return;
        const rawSessions = container.sessions || {};
        const rawPerms = container.originPermissions || {};
        const rawRequests = container.pendingRequests || {};

        // Load permissions
        for (const [o, accounts] of Object.entries(rawPerms))
          if (Array.isArray(accounts))
            originPermissions[o] = accounts as string[];

        // Clean up any orphaned pending requests from previous session
        cleanupOrphanedRequests(rawRequests);

        // Validate each session: tab exists & origin matches current tab URL origin
        const tabIds = Object.keys(rawSessions);
        if (!tabIds.length) return;
        // eslint-disable-next-line sonarjs/cognitive-complexity
        chrome.tabs.query({}, (tabs) => {
          const tabMap: Record<number, chrome.tabs.Tab> = {};
          for (const t of tabs) if (!!t.id) tabMap[t.id] = t;
          for (const tidStr of tabIds) {
            const tid = Number(tidStr);
            const sess = rawSessions[tidStr];
            if (!sess) continue;
            const tab = tabMap[tid];
            if (!tab?.url) continue;
            let currentOrigin = '';
            try {
              currentOrigin = new URL(tab.url).origin;
            } catch {}
            if (currentOrigin && currentOrigin === sess.origin) {
              sessions[tid] = { origin: sess.origin };
              const accounts = originPermissions[sess.origin] || [];
              if (accounts.length)
                emitEvent(tid, PROVIDER_EVENT.ACCOUNTS_CHANGED, [accounts]);
            }
          }
        });
      } catch (e) {
        log('restore parse error', e);
      }
    });
  } catch (e) {
    log('restore failed', e);
  }
}

restoreState();

// -----------------------------
// Utility helpers
// -----------------------------

function cleanupOrphanedRequests(rawRequests: Record<string, any>) {
  if (Object.keys(rawRequests).length === 0) return;

  log('restoring and cleaning up pending requests', {
    count: Object.keys(rawRequests).length,
  });

  chrome.windows.getAll({ populate: false }, (windows) => {
    const popupUrl = chrome.runtime.getURL('index.html');
    for (const [idStr, req] of Object.entries(rawRequests)) {
      const id = Number(idStr);
      const request = req as PendingRequest;
      log('cleaning up orphaned request', { id, method: request.method });

      // Try to send rejection if tab still exists
      chrome.tabs.get(request.tabId, (tab) => {
        if (!chrome.runtime.lastError && tab) {
          respond(request.tabId, {
            id: request.id,
            error: {
              code: ERR_REJECTED.code,
              message: 'Extension restarted - request cancelled.',
            },
          });
          emitEvent(request.tabId, PROVIDER_EVENT.POPUP_CLOSED, [
            { requestId: id, reason: 'extension_restart' },
          ]);
        }
      });

      // Close any matching popup windows
      windows.forEach((win) => {
        if (win.type === 'popup' && win.id) {
          chrome.tabs.query({ windowId: win.id }, (tabs) => {
            if (
              tabs[0]?.url?.startsWith(popupUrl) &&
              tabs[0].url.includes(`id=${id}`)
            ) {
              chrome.windows.remove(win.id!);
            }
          });
        }
      });
    }
  });
}

function extractOrigin(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}

function respond(tabId: number, payload: RpcSuccess | RpcError) {
  sendMessage(BRIDGE_MESSAGE.RPC_RESPONSE, payload, `content-script@${tabId}`);
}

function emitEvent(tabId: number, event: string, args: any[] = []) {
  sendMessage(
    BRIDGE_MESSAGE.PROVIDER_EVENT,
    {
      event,
      args,
    },
    `content-script@${tabId}`
  );
}

function disconnectSession(
  tabId: number,
  message: string = ERR_DISCONNECTED.message
) {
  if (sessions[tabId]) delete sessions[tabId];
  emitEvent(tabId, PROVIDER_EVENT.ACCOUNTS_CHANGED, [[]]);
  emitEvent(tabId, PROVIDER_EVENT.DISCONNECT, [
    { code: ERR_DISCONNECTED.code, message },
  ]);
  schedulePersist();
}

function hasActivePopup(tabId: number, excludeRequestId?: number) {
  return !!Object.values(pendingRequest).find(
    (p) => p.tabId === tabId && !!p.popupWindowId && p.id !== excludeRequestId
  );
}

function errorOnActivePopup(pr: PendingRequest): boolean {
  if (hasActivePopup(pr.tabId, pr.id)) {
    respond(pr.tabId, {
      id: pr.id,
      error: { code: ERR_PENDING.code, message: ERR_PENDING.message },
    });
    finalize(pr.id);
    return false;
  }
  return true;
}

function openPopup(
  id: number,
  extra: Record<string, string> = {},
  w = 360,
  h = 720
) {
  // Auto-timeout rejects after POPUP_TIMEOUT_MS if user takes no action
  popupTimers[id] = setTimeout(() => {
    const req = pendingRequest[id];
    if (!req) return;
    log('popup timeout', { id });
    respond(req.tabId, {
      id: req.id,
      error: { code: ERR_REJECTED.code, message: 'Request timed out.' },
    });
    emitEvent(req.tabId, PROVIDER_EVENT.POPUP_CLOSED, [
      { requestId: id, reason: 'timeout' },
    ]);
    closePopup(id);
    finalize(id);
  }, POPUP_TIMEOUT_MS) as unknown as number;
  const req = pendingRequest[id];
  const qp: Record<string, string> = {
    id: String(id),
    origin: req?.origin ?? '',
    title: req?.siteTitle ?? '',
    type: 'webPageRequest',
    ...extra,
  };
  const q = new URLSearchParams(qp).toString();
  const url = chrome.runtime.getURL('index.html') + `?${q}`;
  chrome.windows.create({ url, type: 'popup', width: w, height: h }, (win) => {
    if (win?.id) {
      pendingRequest[id].popupWindowId = win.id;
      emitEvent(req.tabId, PROVIDER_EVENT.POPUP_OPENED, [
        { requestId: id, windowId: win.id, method: req.method },
      ]);
    }
  });
}

function handleRequestAccounts(req: PendingRequest) {
  openPopup(req.id, { method: AKASHIC_METHOD.REQUEST_ACCOUNTS });
}

function handleSignTypedDataV4(req: PendingRequest) {
  const typed = req.params?.[0];
  openPopup(req.id, {
    method: AKASHIC_METHOD.SIGN_TYPED_DATA,
    data: encodeURIComponent(JSON.stringify(typed ?? {})),
    primaryType: typed.primaryType ?? '',
  });
}

function finalize(id: number) {
  if (popupTimers[id]) {
    clearTimeout(popupTimers[id]);
    delete popupTimers[id];
  }
  delete pendingRequest[id];
  schedulePersist();
}

// DRY helper for session + origin validation flows that need an active session
function withAuthorizedSession(
  pr: PendingRequest,
  onOk: (sess: SessionInfo) => void
) {
  const tId = pr.tabId;
  if (!sessions[tId]) {
    respond(tId, {
      id: pr.id,
      error: { code: ERR_UNAUTHORIZED.code, message: ERR_UNAUTHORIZED.message },
    });
    finalize(pr.id);
    return;
  }
  const sess = sessions[tId];
  if (sess.origin !== pr.origin) {
    disconnectSession(tId, 'Origin changed – reconnect required');
    respond(tId, {
      id: pr.id,
      error: {
        code: ERR_UNAUTHORIZED.code,
        message: 'Origin changed – please reconnect',
      },
    });
    finalize(pr.id);
    return;
  }
  onOk(sess);
}

// Close popup window if still open
function closePopup(id: number) {
  const wId = pendingRequest[id]?.popupWindowId;
  if (!!wId)
    chrome.windows.remove(wId, () => {
      if (chrome.runtime.lastError) {
        log('Failed to close popup', chrome.runtime.lastError);
      }
    });
}

function log(message: string, obj?: any) {
  process.env.REACT_APP_PROVIDER_DEBUG === 'true' &&
    console.log(`[AkashicLink][background] ${message}`, obj ?? '');
}

// -----------------------------
// Central message router
// -----------------------------

chrome.runtime.onInstalled.addListener(() => {
  log('installed');
});

// Handle webext-bridge messages
onMessage(BRIDGE_MESSAGE.INIT_REQUEST, ({ data, sender }) => {
  handleInitRequest(
    data as BridgeMessageProtocolMap[BRIDGE_MESSAGE.INIT_REQUEST],
    sender
  );
});

onMessage(BRIDGE_MESSAGE.RPC_REQUEST, ({ data, sender }) => {
  handleRpcRequest(
    data as BridgeMessageProtocolMap[BRIDGE_MESSAGE.RPC_REQUEST],
    sender
  );
});

onMessage(BRIDGE_MESSAGE.APPROVAL_DECISION, ({ data }) => {
  handleApprovalDecision(
    data as BridgeMessageProtocolMap[BRIDGE_MESSAGE.APPROVAL_DECISION]
  );
});

onMessage(BRIDGE_MESSAGE.INTERNAL_LOGOUT, () => {
  handleInternalLogout();
});

// Handler for INIT_REQUEST
function handleInitRequest(
  data: BridgeMessageProtocolMap[BRIDGE_MESSAGE.INIT_REQUEST],
  sender: any
) {
  if (!sender.tabId) return;
  const tId = sender.tabId;
  const origin = data.origin || extractOrigin(sender.tab?.url);
  if (origin && originPermissions[origin] && !sessions[tId]) {
    sessions[tId] = { origin };
    const accounts = originPermissions[origin];
    if (accounts.length)
      emitEvent(tId, PROVIDER_EVENT.ACCOUNTS_CHANGED, [accounts]);
    schedulePersist();
  }
  sendMessage(
    BRIDGE_MESSAGE.INIT_RESPONSE,
    {
      version: EXT_VERSION,
      env: EXT_ENV,
    },
    `content-script@${tId}`
  );
}

// Handler for RPC_REQUEST
// eslint-disable-next-line sonarjs/cognitive-complexity
function handleRpcRequest(
  data: BridgeMessageProtocolMap[BRIDGE_MESSAGE.RPC_REQUEST],
  sender: any
) {
  if (!sender.tabId) return;
  const { id, method, params, meta } = data;
  pendingRequest[id] = {
    id,
    method,
    params,
    origin: meta?.origin || extractOrigin(sender.tab?.url),
    siteTitle: meta?.title || sender.tab?.title,
    tabId: sender.tabId,
  };
  log('rpc_request', { id, method });
  schedulePersist();
  switch (method) {
    case AKASHIC_METHOD.REQUEST_ACCOUNTS:
      if (errorOnActivePopup(pendingRequest[id]))
        handleRequestAccounts(pendingRequest[id]);
      break;
    case AKASHIC_METHOD.ACCOUNTS: {
      const pr = pendingRequest[id];
      const origin = pr.origin;
      const tId = pr.tabId;
      let result: string[] = [];
      if (!!tId && sessions[tId]) {
        result = originPermissions[sessions[tId].origin] || [];
      } else if (origin && originPermissions[origin]) {
        if (!!tId) {
          sessions[tId] = { origin };
          const accounts = originPermissions[origin];
          if (accounts.length)
            emitEvent(tId, PROVIDER_EVENT.ACCOUNTS_CHANGED, [accounts]);
          schedulePersist();
        }
        result = originPermissions[origin];
      }
      respond(tId, { id, result });
      finalize(id);
      break;
    }
    case AKASHIC_METHOD.SIGN_TYPED_DATA: {
      if (!errorOnActivePopup(pendingRequest[id])) break;
      withAuthorizedSession(pendingRequest[id], () =>
        handleSignTypedDataV4(pendingRequest[id])
      );
      break;
    }
    case WALLET_METHOD.CLOSE_POPUP: {
      const targetId = params?.[0];
      const callerTab = pendingRequest[id].tabId;
      if (
        !!targetId &&
        pendingRequest[targetId] &&
        pendingRequest[targetId].tabId === callerTab
      ) {
        const target = pendingRequest[targetId];
        respond(target.tabId, {
          id: target.id,
          error: {
            code: ERR_REJECTED.code,
            message: 'User cancelled from dApp.',
          },
        });
        emitEvent(target.tabId, PROVIDER_EVENT.POPUP_CLOSED, [
          { requestId: target.id, reason: 'cancelled' },
        ]);
        closePopup(target.id);
        finalize(target.id);
        respond(callerTab, { id, result: true });
      } else {
        respond(callerTab, {
          id,
          error: {
            code: ERR_UNSUPPORTED.code,
            message: 'Invalid requestId for closePopup',
          },
        });
      }
      finalize(id);
      break;
    }
    case WALLET_METHOD.DISCONNECT: {
      const tabId = pendingRequest[id].tabId;
      if (sessions[tabId]) disconnectSession(tabId);
      respond(pendingRequest[id].tabId, {
        id,
        result: true,
      });
      finalize(id);
      break;
    }
    case WALLET_METHOD.LOCK_WALLET: {
      if (!errorOnActivePopup(pendingRequest[id])) break;
      openPopup(id, { method: WALLET_METHOD.LOCK_WALLET });
      break;
    }
    default:
      respond(pendingRequest[id].tabId, {
        id,
        error: { ...ERR_UNSUPPORTED },
      });
      finalize(id);
  }
}

// Handler for APPROVAL_DECISION
function handleApprovalDecision(
  msg: BridgeMessageProtocolMap[BRIDGE_MESSAGE.APPROVAL_DECISION]
) {
  const { id, approved, reason, result } = msg;
  const req = pendingRequest[id];
  if (!req) {
    log('approval_decision for unknown request (likely timed out)', { id });
    // Close any orphaned popup window that might still be open
    chrome.windows.getAll({ populate: false }, (windows) => {
      const popupUrl = chrome.runtime.getURL('index.html');
      windows.forEach((win) => {
        if (win.type === 'popup' && win.id) {
          chrome.tabs.query({ windowId: win.id }, (tabs) => {
            if (
              tabs[0]?.url?.startsWith(popupUrl) &&
              tabs[0].url.includes(`id=${id}`)
            ) {
              chrome.windows.remove(win.id!);
            }
          });
        }
      });
    });
    return;
  }
  log('approval_decision', {
    id,
    approved,
    reason,
  });
  if (approved) {
    switch (req.method) {
      case AKASHIC_METHOD.REQUEST_ACCOUNTS: {
        const response = result as IRequestAccountsReturnType;
        sessions[req.tabId] = {
          origin: req.origin ?? '',
        };
        if (req.origin)
          originPermissions[req.origin] = [response.payload.identity];
        respond(req.tabId, { id: req.id, result: response });
        schedulePersist();
        break;
      }
      case AKASHIC_METHOD.SIGN_TYPED_DATA: {
        const response = result as ISignTypedDataReturnType;
        respond(req.tabId, { id: req.id, result: response });
        break;
      }
      case WALLET_METHOD.LOCK_WALLET: {
        respond(req.tabId, { id: req.id, result: true });
        schedulePersist();
        break;
      }
      default:
        respond(req.tabId, {
          id: req.id,
          error: {
            code: ERR_UNSUPPORTED.code,
            message: ERR_UNSUPPORTED.message,
          },
        });
    }
  } else {
    respond(req.tabId, {
      id: req.id,
      error: {
        code: ERR_REJECTED.code,
        message: reason ?? ERR_REJECTED.message,
      },
    });
  }
  closePopup(id);
  emitEvent(req.tabId, PROVIDER_EVENT.POPUP_CLOSED, [
    { requestId: id, resolution: approved ? 'approved' : 'rejected' },
  ]);
  finalize(id);
}

// Handler for INTERNAL_LOGOUT
function handleInternalLogout() {
  const tabIds = Object.keys(sessions).map((k) => Number(k));
  log('logout ALL sessions', {
    count: tabIds.length,
  });

  // Disconnect all active sessions
  for (const tabId of tabIds) {
    log('logout session', { tabId });
    disconnectSession(tabId);
  }

  // Clear the AKASHIC_STATE_V1 key from chrome storage
  try {
    chrome.storage.local.remove(ROOT_KEY);
    log('cleared AKASHIC_STATE_V1 from chrome.storage.local');
  } catch (e) {
    log('failed to clear AKASHIC_STATE_V1', e);
  }

  // Clear auto-lock alarm
  clearAutoLockAlarm();

  schedulePersist();
}

// Detect manual popup window close -> auto reject pendingRequest
chrome.windows.onRemoved.addListener((windowId) => {
  const match = Object.values(pendingRequest).find(
    (p) => p.popupWindowId === windowId
  );
  if (!match) return;
  log('popup closed before decision', {
    id: match.id,
  });
  respond(match.tabId, {
    id: match.id,
    error: { code: ERR_REJECTED.code, message: 'User closed the popup.' },
  });
  emitEvent(match.tabId, PROVIDER_EVENT.POPUP_CLOSED, [
    { requestId: match.id, reason: 'window_closed' },
  ]);
  finalize(match.id);
});

// -----------------------------
// Auto-Lock
// -----------------------------
// Receive an event when an auto-lock time is reached (wallet auto logout/lock UI trigger).

const AUTOLOCK_ALARM = 'autoLockAlarm';

async function scheduleAutoLockAlarm(targetMs?: number) {
  // Clear existing alarm first (idempotent)
  const existing = await chrome.alarms.get(AUTOLOCK_ALARM).catch((err) => {
    log('Error getting autoLockAlarm', err);
    return undefined;
  });
  if (existing)
    await chrome.alarms
      .clear(AUTOLOCK_ALARM)
      .catch((err) => log('Failed to clear autoLockAlarm', err));
  if (!!targetMs && targetMs > Date.now()) {
    await chrome.alarms.create(AUTOLOCK_ALARM, { when: targetMs });
    log('auto-lock alarm scheduled', new Date(targetMs).toISOString());
  } else if (!!targetMs) {
    // Target already passed -> fire immediately via direct notify
    handleInternalLogout();
  }
}

async function clearAutoLockAlarm() {
  await chrome.alarms
    .clear(AUTOLOCK_ALARM)
    .catch((err) => log('Failed to clear autoLockAlarm', err));
  log('auto-lock alarm cleared');
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== AUTOLOCK_ALARM) return;
  const { [APP_AUTO_LOCK_BY]: autoLockBy } =
    await chrome.storage.session.get(APP_AUTO_LOCK_BY);
  if (!!autoLockBy && Date.now() >= autoLockBy) {
    handleInternalLogout();
  }
});

async function initAutoLockState() {
  try {
    const { [APP_AUTO_LOCK_BY]: autoLockBy } =
      await chrome.storage.session.get(APP_AUTO_LOCK_BY);
    if (!!autoLockBy) {
      scheduleAutoLockAlarm(autoLockBy);
    }
  } catch (e) {
    log('initAutoLockState error', e);
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'session') return; // we only care about session storage updates for auto-lock
  if (APP_AUTO_LOCK_BY in changes) {
    const newVal = changes[APP_AUTO_LOCK_BY].newValue;
    if (!!newVal) {
      scheduleAutoLockAlarm(newVal);
    } else {
      clearAutoLockAlarm();
    }
  }
});

// Initialize auto-lock
initAutoLockState();
