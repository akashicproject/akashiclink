/* eslint-disable @typescript-eslint/no-explicit-any */

// webext-bridge message id
export enum BRIDGE_MESSAGE {
  // Background <-> Content Script messages
  INIT_REQUEST = 'init_request',
  INIT_RESPONSE = 'init_response',
  RPC_RESPONSE = 'rpc_response',
  RPC_REQUEST = 'rpc_request',
  PROVIDER_EVENT = 'provider_event',
  // Extension UI <-> Background messages
  INTERNAL_LOGOUT = 'internal_logout',
  APPROVAL_DECISION = 'approval_decision',
}

// webext-bridge message types for AkashicLink extension
export interface BridgeMessageProtocolMap {
  [BRIDGE_MESSAGE.INIT_REQUEST]: {
    origin?: string;
    title?: string;
  };
  [BRIDGE_MESSAGE.INIT_RESPONSE]: {
    token: string;
    version: string;
    env: string;
  };
  [BRIDGE_MESSAGE.RPC_REQUEST]: {
    id: number;
    method: string;
    params?: any[];
    meta?: {
      origin: string;
      title: string;
    };
  };
  [BRIDGE_MESSAGE.RPC_RESPONSE]: {
    id: number;
    result?: any;
    error?: { code: number; message: string };
  };
  [BRIDGE_MESSAGE.PROVIDER_EVENT]: {
    token: string;
    event: string;
    args: any[];
  };

  [BRIDGE_MESSAGE.APPROVAL_DECISION]: {
    id: number;
    approved: boolean;
    result?: any;
    reason?: string;
  };
  [BRIDGE_MESSAGE.INTERNAL_LOGOUT]: void;
}
