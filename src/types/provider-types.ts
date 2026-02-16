/* eslint-disable @typescript-eslint/no-explicit-any */

// Shared constants for AkashicLink extension
export const EXT_ENV =
  process.env.REACT_APP_PROVIDER_ENV || process.env.REACT_APP_ENV || 'dev';
export const EXT_VERSION = '1.0.0';

// Error objects (frozen to prevent mutation)
export const ERR_UNSUPPORTED = Object.freeze({
  code: 4200,
  message: 'Unsupported method',
});
export const ERR_UNAUTHORIZED = Object.freeze({
  code: 4100,
  message: 'Unauthorized: please connect first',
});
export const ERR_REJECTED = Object.freeze({
  code: 4001,
  message: 'User rejected the request.',
});
export const ERR_DISCONNECTED = Object.freeze({
  code: 4900,
  message: 'User disconnected',
});
export const ERR_PENDING = Object.freeze({
  code: 4201,
  message: 'Another request is already pending',
});

// Custom AkashicChain RPC methods
export enum AKASHIC_METHOD {
  ACCOUNTS = 'akashic_accounts',
  REQUEST_ACCOUNTS = 'akashic_requestAccounts',
  SIGN_TYPED_DATA = 'akashic_signTypedData',
  SIGN_TRANSACTION = 'akashic_signTransaction',
}

// Custom AkashicLink methods
export enum WALLET_METHOD {
  CLOSE_POPUP = 'wallet_closePopup',
  DISCONNECT = 'wallet_disconnect',
  LOCK_WALLET = 'wallet_lockWallet',
}

// Events emitted by the provider
export enum PROVIDER_EVENT {
  ACCOUNTS_CHANGED = 'accountsChanged',
  DISCONNECT = 'disconnect',
  POPUP_CLOSED = 'popupClosed',
  POPUP_OPENED = 'popupOpened',
}

// TODO: change to array of identities in future if multiple account support
// and we don't need signature when the new Web3 auth flow implemented
export type IRequestAccountsReturnType = {
  payload: {
    identity: string;
    expires: number;
  };
  signature: string;
  walletPreference: {
    theme: string;
    language: string;
  };
};

export type IAccountsReturnType = string[];

export type ISignTypedDataReturnType = string;

export type ISignTransactionReturnType = string;

// NOTE:
// Originally this type attempted to declare a property using a computed key: {[CHANNEL]: string;}
// However, CHANNEL is a runtime string (not a string literal type), so TypeScript disallows
// using it as a computed property name in a type literal. At runtime we still include a
// property whose key is the value of CHANNEL. To model this safely we keep the explicit
// structured fields and add a broad string index signature to allow the dynamic channel key.
export type ApprovalMessage = {
  id: number;
  approved: boolean;
  result?:
    | IRequestAccountsReturnType
    | ISignTypedDataReturnType
    | ISignTransactionReturnType;
  reason?: string;
  // Dynamic channel property keyed by the runtime value of CHANNEL
  [dynamicChannelKey: string]: unknown;
};

// Constants for communication with content script
export const PAGE_CHANNEL = `__akashicLink_${EXT_ENV}`;

// Content Script <-> Injected Script messages (via window.postMessage)
export enum PAGE_EVENT {
  REQUEST = 'request',
  RESPONSE = 'response',
  INIT = 'init',
  PROVIDER_EVENT = 'provider_event',
  INJECTED_READY = 'injected_ready',
}

// EIP-1193 Provider Interface
export interface EIP1193Provider {
  // Methods
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;

  // Events
  on(eventName: string, listener: (...args: unknown[]) => void): this;
  removeListener(
    eventName: string,
    listener: (...args: unknown[]) => void
  ): this;

  // Properties
  isConnected(): boolean;
}

export type JsonRpcRequest = {
  id: number;
  method: string;
  params?: any[];
};

export type JsonRpcResponse = {
  id: number;
  result?: any;
  error?: { code: number; message: string };
};
