import { type IOwnerOldestKeysResponse } from '@helium-pay/backend';

import {
  type ICurrencyForExtension,
  SUPPORTED_CURRENCIES_FOR_EXTENSION,
} from '../../constants/currencies';
import {
  type LocalStoredL1AddressType,
  useAccountStorage,
} from './useLocalAccounts';
import { useOwnerKeys } from './useOwnerKeys';

export const useFetchAndRemapL1Address = () => {
  const { activeAccount } = useAccountStorage();
  const { setLocalStoredL1Addresses } = useAccountStorage();
  const { keys: addresses } = useOwnerKeys(activeAccount?.identity ?? '');

  const mapAddressToWallet = (
    addresses: IOwnerOldestKeysResponse[],
    currencies: ICurrencyForExtension
  ) => {
    const walletCurrency = currencies.walletCurrency;
    const address = addresses?.find(
      (addr) =>
        addr.coinSymbol.toLowerCase() === walletCurrency.chain.toLowerCase()
    )?.address;

    return address;
  };

  return async () => {
    if (addresses.length && activeAccount) {
      const addresses: LocalStoredL1AddressType[] = [];
      // stores L1 addresses for active user
      SUPPORTED_CURRENCIES_FOR_EXTENSION.list.forEach((currencies) => {
        const foundLocalL1Address = activeAccount.localStoredL1Addresses?.find(
          (addr) => addr.coinSymbol === currencies.walletCurrency.chain
        );
        // if not found, add it
        if (
          !foundLocalL1Address &&
          addresses.findIndex(
            (e) => e.coinSymbol === currencies.walletCurrency.chain
          ) === -1
        ) {
          addresses.push({
            coinSymbol: currencies.walletCurrency.chain,
            address: mapAddressToWallet(addresses, currencies) ?? '',
          });
        }
      });
      setLocalStoredL1Addresses(addresses, activeAccount.identity);
    }
  };
};
