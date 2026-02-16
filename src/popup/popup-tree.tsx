import { AKASHIC_METHOD, WALLET_METHOD } from '../types/provider-types';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { PopupUnlockOrCreateAndImportWallet } from './popup-unlock-create-import-wallet';
import { SendTransaction } from './send-transaction';
import { SignTransaction } from './sign-transaction';
import { SignTypedData } from './sign-typed-data';
import { WalletConnection } from './wallet-connection';
import { WalletLock } from './wallet-lock';

export function PopupTree() {
  const query = new URLSearchParams(window.location.search);
  const method = query.get('method');
  const { authenticated } = useAccountStorage();

  if (method === WALLET_METHOD.LOCK_WALLET) {
    return <WalletLock />;
  }

  if (!authenticated) {
    return <PopupUnlockOrCreateAndImportWallet />;
  }

  if (method === AKASHIC_METHOD.REQUEST_ACCOUNTS) {
    return <WalletConnection />;
  }

  if (method === AKASHIC_METHOD.SIGN_TYPED_DATA) {
    return <SignTypedData />;
  }

  if (method === AKASHIC_METHOD.SIGN_TRANSACTION) {
    return <SignTransaction />;
  }

  if (method === AKASHIC_METHOD.SEND_TRANSACTION) {
    return <SendTransaction />;
  }

  // TODO: handle invalid request
  return null;
}
