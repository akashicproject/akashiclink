import { ALLOWED_NETWORKS } from '../../constants/currencies';
import {
  type LocalStoredL1AddressType,
  useAccountStorage,
} from './useLocalAccounts';
import { useOwnerKeys } from './useOwnerKeys';

// BE AWARE THAT THIS HOOK "SNAPSHOT" `localAccounts` (`setLocalStoredL1Addresses` to be exact),
// choose wisely WHEN you initialize this hook, or you might be using an older copy of localAccounts
export const useFetchAndRemapL1Address = () => {
  const { activeAccount } = useAccountStorage();
  const { setLocalStoredL1Addresses } = useAccountStorage();
  const { keys: addresses } = useOwnerKeys(activeAccount?.identity ?? '');

  return async () => {
    if (!addresses?.length || !activeAccount) return;

    const newAddresses: LocalStoredL1AddressType[] = ALLOWED_NETWORKS.map(
      (chain) => {
        const l1 = addresses.find(
          (a) => a.coinSymbol.toLowerCase() === chain.toLowerCase()
        );
        const localL1 = activeAccount?.localStoredL1Addresses?.find(
          (a) =>
            a.coinSymbol.toLowerCase() === chain.toLowerCase() &&
            typeof a.address === 'string'
        );

        return {
          coinSymbol: chain,
          address: l1?.address ?? localL1?.address ?? '', // addresses return from endpoint take higher priority
        };
      }
    );

    setLocalStoredL1Addresses({
      identity: activeAccount.identity,
      otkType: activeAccount.otkType,
      newL1Addresses: newAddresses,
    });
  };
};
