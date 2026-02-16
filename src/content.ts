import { onMessage, sendMessage } from 'webext-bridge/content-script';

import {
  BRIDGE_MESSAGE,
  type BridgeMessageProtocolMap,
} from './types/bridge-types';
import { PAGE_CHANNEL, PAGE_EVENT } from './types/provider-types';

(function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function log(message: string, obj?: any, ...args: any[]) {
    process.env.REACT_APP_PROVIDER_DEBUG === 'true' &&
      console.log(`[AkashicLink][content] ${message}`, obj || '', ...args);
  }

  // Inject the provider script into the actual page context
  const inject = () => {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.async = false;
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
  };
  inject();

  // Perform handshake to receive token/version/chainId once injected script signals readiness
  let initSent = false;
  const sendInit = () => {
    if (initSent) return;
    initSent = true;
    sendMessage(
      BRIDGE_MESSAGE.INIT_REQUEST,
      {
        origin: window.location.origin,
        title: document.title,
      },
      'background'
    );
  };
  // Fallback timeout in case injected_ready is missed
  setTimeout(sendInit, 500);
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.source !== window || !event.data) return;
    if (event.data[PAGE_CHANNEL] === PAGE_EVENT.INJECTED_READY) {
      sendInit();
    }
  });

  // Perform handshake to receive token/version

  // Listen for page requests
  window.addEventListener('message', async (event) => {
    if (event.origin !== window.location.origin) return;

    if (
      event.source !== window ||
      !event.data ||
      event.data[PAGE_CHANNEL] !== PAGE_EVENT.REQUEST
    )
      return;
    const { payload } = event.data;
    const { id, method } = payload;
    log('forward rpc_request', { id, method });
    const meta = { origin: window.location.origin, title: document.title };
    sendMessage(
      BRIDGE_MESSAGE.RPC_REQUEST,
      {
        id,
        method,
        params: payload.params,
        meta,
      },
      'background'
    );
  });

  // Listen for background responses
  onMessage(BRIDGE_MESSAGE.RPC_RESPONSE, ({ data }) => {
    const response =
      data as BridgeMessageProtocolMap[BRIDGE_MESSAGE.RPC_RESPONSE];
    log('rpc_response -> page', response);
    // Security: send only to explicit origin (SonarJS rule sonarjs/post-message)
    window.postMessage(
      { [PAGE_CHANNEL]: PAGE_EVENT.RESPONSE, payload: response },
      window.location.origin
    );
  });

  // Handshake response
  onMessage(BRIDGE_MESSAGE.INIT_RESPONSE, ({ data }) => {
    const { version, env } =
      data as BridgeMessageProtocolMap[BRIDGE_MESSAGE.INIT_RESPONSE];
    log('init_response', { version, env });
    window.postMessage({ [PAGE_CHANNEL]: PAGE_EVENT.INIT, version, env });
  });

  // Forward provider events (accountsChanged, disconnect, etc.) to injected page
  onMessage(BRIDGE_MESSAGE.PROVIDER_EVENT, ({ data }) => {
    const { event, args } =
      data as BridgeMessageProtocolMap[BRIDGE_MESSAGE.PROVIDER_EVENT];
    log('provider_event -> page', event, args);
    window.postMessage({
      [PAGE_CHANNEL]: PAGE_EVENT.PROVIDER_EVENT,
      event,
      args,
    });
  });
})();
