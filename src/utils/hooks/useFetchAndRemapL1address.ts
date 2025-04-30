import { ALLOWED_NETWORKS } from '../../constants/currencies';
import {
  type LocalStoredL1AddressType,
  useAccountStorage,
} from './useLocalAccounts';
import { useOwnerKeys } from './useOwnerKeys';

export const useFetchAndRemapL1Address = () => {
  const { activeAccount } = useAccountStorage();
  const { setLocalStoredL1Addresses } = useAccountStorage();
  const { keys: addresses } = useOwnerKeys(activeAccount?.identity ?? '');

  return async () => {
    if (!addresses?.length || !activeAccount) return;

    const newAddresses = ALLOWED_NETWORKS.map((chain) => {
      const l1 = addresses.find(
        (a) => a.coinSymbol.toLowerCase() === chain.toLowerCase()
      );
      const localL1 = activeAccount?.localStoredL1Addresses?.find(
        (a) => a.coinSymbol.toLowerCase() === chain.toLowerCase()
      );

      return {
        coinSymbol: chain,
        address: l1?.address ?? localL1 ?? '', // addresses return from endpoint take higher priority
      } as LocalStoredL1AddressType;
    });

    setLocalStoredL1Addresses(activeAccount.identity, newAddresses);
  };
};
