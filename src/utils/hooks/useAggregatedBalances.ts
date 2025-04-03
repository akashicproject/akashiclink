import { NetworkDictionary } from '@helium-pay/backend';
import { useEffect, useState } from 'react';

import { useFocusCurrencyDetail } from '../../components/providers/PreferenceProvider';
import { makeWalletCurrency } from '../../constants/currencies';
import { CurrencyMap } from '../currencyMap';
import { useBalancesMe } from './useBalancesMe';

/** Map balances from backend onto the currencies supported nby the wallet */
export function useAggregatedBalances() {
  const { keys: userBalances } = useBalancesMe();
  const userBalancesStringify = JSON.stringify(userBalances);

  const [aggregatedBalances, setAggregatedBalances] = useState(
    new CurrencyMap<string>()
  );

  useEffect(() => {
    const updatedAggregatedBalances = new CurrencyMap<string>();
    for (const { coinSymbol, tokenSymbol, balance } of userBalances)
      updatedAggregatedBalances.set(
        makeWalletCurrency(coinSymbol, tokenSymbol),
        balance
      );
    setAggregatedBalances(updatedAggregatedBalances);
  }, [userBalancesStringify]);

  return aggregatedBalances;
}

export function useFocusCurrencySymbolsAndBalances() {
  const aggregatedBalances = useAggregatedBalances();
  const walletCurrency = useFocusCurrencyDetail();

  const isCurrencyTypeToken = typeof walletCurrency.token !== 'undefined';
  const nativeCoin = NetworkDictionary[walletCurrency.chain].nativeCoin;

  return {
    isCurrencyTypeToken,
    networkCurrencyCombinedDisplayName: walletCurrency.displayName,
    currencySymbol: isCurrencyTypeToken
      ? (walletCurrency.token as string)
      : nativeCoin.displayName,
    currencyBalance:
      aggregatedBalances.get(
        isCurrencyTypeToken
          ? walletCurrency
          : {
              displayName: nativeCoin.displayName,
              chain: walletCurrency.chain,
            }
      ) ?? '0',
    nativeCoinSymbol: nativeCoin.displayName,
    nativeCoinBalance:
      aggregatedBalances.get({
        displayName: nativeCoin.displayName,
        chain: walletCurrency.chain,
      }) ?? '0',
  };
}
