/* eslint-disable @typescript-eslint/no-explicit-any */
interface AkashicProvider {
  isAkashicLink: boolean;
  request<T = any>(args: { method: string; params?: any[] }): Promise<T>;
  on?(event: string, listener: (...args: any[]) => void): this;
  removeListener?(event: string, listener: (...args: any[]) => void): this;
}

// Non-standard internal event names used by AkashicLink extension:
// - popupOpened: { requestId: number; windowId: number; method: string }
// - popupClosed: { requestId: number; reason?: string; resolution?: 'approved' | 'rejected' }
// Non-standard RPC helper methods:
// - wallet_closePopup(requestId: number): cancel specific popup by request id
// - wallet_disconnect: disconnect current session (emits accountsChanged([]) + disconnect)
// - wallet_lockWallet: global logout (all sessions cleared, disconnect events broadcast to every tab)
// Behavior notes:
// - Previously granted origins auto-approve eth_requestAccounts without opening a popup.

interface Window {
  __AKASHIC_PROVIDERS?: { [env: string]: AkashicProvider };
}
