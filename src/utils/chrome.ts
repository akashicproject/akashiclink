import { datadogRum } from '@datadog/browser-rum';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import type {
  IRequestAccountsReturnType,
  ISendTransactionReturnType,
  ISignTransactionReturnType,
  ISignTypedDataReturnType,
} from '../types/provider-types';

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
