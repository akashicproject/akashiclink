import { NetworkDictionary } from '@helium-pay/backend';

import { type IWalletCurrency } from '../../constants/currencies';
import { getMainnetEquivalent } from '../chain';
import { useCryptoCurrencyBalance } from './useCryptoCurrencyBalance';
import { useL1TxnDelegatedFees } from './useL1TxnDelegatedFees';

// TODO: check if this is duplicated with other hooks
export function useCryptoCurrencySymbolsAndBalances(
  walletCurrency: IWalletCurrency
) {
  const { delegatedFeeList } = useL1TxnDelegatedFees();

  const { balance: currencyBalance } = useCryptoCurrencyBalance(walletCurrency);
  const { balance: nativeCoinBalance } = useCryptoCurrencyBalance({
    ...walletCurrency,
    token: undefined,
  });

  const isCurrencyTypeToken = typeof walletCurrency.token !== 'undefined';
  const nativeCoin = NetworkDictionary[walletCurrency.chain].nativeCoin;
  const delegatedFee =
    delegatedFeeList.find(
      (fee) => fee.coinSymbol === getMainnetEquivalent(walletCurrency.chain)
    )?.delegatedFee ?? '0';

  return {
    isCurrencyTypeToken,
    chain: walletCurrency.chain,
    token: walletCurrency.token,
    networkCurrencyCombinedDisplayName: walletCurrency.displayName,
    currencySymbol: isCurrencyTypeToken
      ? (walletCurrency.token as string)
      : nativeCoin.displayName,
    currencyBalance: currencyBalance ?? '0',
    nativeCoinSymbol: nativeCoin.displayName,
    nativeCoinBalance: nativeCoinBalance ?? '0',
    delegatedFee: delegatedFee,
  };
}
