import { datadogRum } from '@datadog/browser-rum';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import type {
  IRequestAccountsReturnType,
  ISendTransactionReturnType,
  ISignTransactionReturnType,
  ISignTypedDataReturnType,
} from '../types/provider-types';

export const EXTENSION_EVENT = {
  USER_CLOSED_POPUP: 'USER_CLOSED_POPUP',
  POPUP_READY: 'POPUP_READY',
  USER_LOCKED_WALLET: 'USER_LOCKED_WALLET',
  WALLET_AUTO_LOCKED: 'WALLET_AUTO_LOCKED',
};

export const EXTENSION_ERROR = {
  UNKNOWN: 'UNKNOWN',
  RECEIVING_END_DOES_NOT_EXIST:
    'Could not establish connection. Receiving end does not exist.', // chrome error string
  WC_NOT_FOUND: 'WC_NOT_FOUND',
  WC_SESSION_NOT_FOUND: 'WC_SESSION_NOT_FOUND',
  REQUEST_EXPIRED: 'REQUEST_EXPIRED',
  COULD_NOT_READ_ADDRESS: 'COULD_NOT_READ_ADDRESS',
};

export const ETH_METHOD = {
  PERSONAL_SIGN: 'personal_sign',
  REQUEST_ACCOUNTS: 'eth_requestAccounts',
  SIGN_TYPED_DATA: 'eth_signTypedData_v4',
};

export const WALLET_METHOD = {
  UNLOCK_WALLET: 'UNLOCK_WALLET',
  LOCK_WALLET: 'LOCK_WALLET',
  RESTARTED_WALLET: 'RESTARTED_WALLET',
};

export const TYPED_DATA_PRIMARY_TYPE = {
  AUTHORIZE_ACTION: 'AuthorizeAction',
  PAYOUT: 'Payout',
  GENERATE_SECONDARY_OTK: 'generateSecondaryOtk',
  UPDATE_TREASURY_OTK: 'updateTreasuryOtk',
  REMOVE_TREASURY_OTK: 'removeTreasuryOtk',
  BECOME_FX_BP: 'becomeFxBp',
};

// Check if running in extension context
const isExtensionContext = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
};

// Lazy import webext-bridge only when needed in extension context
/* eslint-disable @typescript-eslint/no-explicit-any */
let sendMessageImpl: any = null;
const getSendMessage = async () => {
  if (!sendMessageImpl && isExtensionContext()) {
    const { sendMessage } = await import('webext-bridge/popup');
    sendMessageImpl = sendMessage;
  }
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  return sendMessageImpl;
};

export const closePopup = async () => {
  if (!isExtensionContext()) return;
  const current = await window?.chrome?.windows?.getCurrent();
  current.id && (await window?.chrome?.windows?.remove(current.id));
};

export const closeAllPopup = async () => {
  try {
    const context = await chrome?.runtime?.getContexts({
      // @ts-ignore
      contextTypes: ['TAB'],
    });

    // @ts-ignore
    context?.forEach((ctx) => {
      chrome.windows.remove(ctx.windowId);
    });
  } catch (e) {
    console.warn(e);
  }
};

export const responseToSite = async (
  messageId: BRIDGE_MESSAGE,
  id?: number,
  approved?: boolean,
  result?:
    | IRequestAccountsReturnType
    | ISignTypedDataReturnType
    | ISignTransactionReturnType
    | ISendTransactionReturnType,
  reason?: string
) => {
  // Skip if not in extension context (dev mode in browser)
  if (!isExtensionContext()) {
    console.log('[Dev Mode] Would send message:', {
      messageId,
      id,
      approved,
      result,
      reason,
    });
    return;
  }

  try {
    const sendMessage = await getSendMessage();
    if (!sendMessage) return;

    // Message is forwarded via webext-bridge to background script
    await sendMessage(
      messageId,
      {
        id,
        approved,
        result,
        reason,
      },
      'background'
    );
  } catch (e) {
    datadogRum.addError(e);
    console.error(
      `Failed to send message to site. messageId=${messageId}, id=${id}, approved=${approved}, result=${JSON.stringify(result)}, reason=${reason}`,
      e
    );
  }
};

export async function responseErrorToSite(
  error: unknown,
  id?: number,
  messageId: BRIDGE_MESSAGE = BRIDGE_MESSAGE.APPROVAL_DECISION
) {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error);
  datadogRum.addError(error);
  if (id) {
    await responseToSite(messageId, id, false, undefined, message);
  }
}
