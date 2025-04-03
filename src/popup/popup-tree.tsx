import { Spinner } from '../components/common/loader/spinner';
import { useOwner } from '../utils/hooks/useOwner';
import { PopupUnlockWallet } from './popup-unlock-wallet';
import { SignMessage } from './sign-message';
import { SignTypedData } from './sign-typed-data';
import { WalletConnection } from './wallet-connection';

export const ETH_METHOD = {
  PersonalSign: 'personal_sign',
  EthRequestAccounts: 'eth_requestAccounts',
  EthSignTypedDataV4: 'eth_signTypedData_v4',
};

export function PopupTree() {
  const query = new URLSearchParams(window.location.search);
  const method = query.get('method');

  // TODO: update with new unlock mechanism
  const { isLoading, authenticated } = useOwner();

  if (isLoading) {
    return <Spinner />;
  }

  if (!authenticated) {
    return <PopupUnlockWallet />;
  }

  if (method === ETH_METHOD.EthRequestAccounts) {
    return <WalletConnection />;
  }

  if (method === ETH_METHOD.PersonalSign) {
    return <SignMessage />;
  }

  // TODO: possible different layout for typed data
  if (method === ETH_METHOD.EthSignTypedDataV4) {
    return <SignTypedData />;
  }

  // TODO: handle invalid request
  return null;
}
