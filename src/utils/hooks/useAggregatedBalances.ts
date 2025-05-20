import { NetworkDictionary, TEST_TO_MAIN } from '@helium-pay/backend';
import { useEffect, useState } from 'react';

import { makeWalletCurrency } from '../../constants/currencies';
import { useAppSelector } from '../../redux/app/hooks';
import { selectFocusCurrencyDetail } from '../../redux/slices/preferenceSlice';
import { CurrencyMap } from '../currencyMap';
import { useAccountMe } from './useAccountMe';
import { useL1TxnDelegatedFees } from './useL1TxnDelegatedFees';

/** Map balances from backend onto the currencies supported nby the wallet */
export function useAggregatedBalances() {
  const { data: account } = useAccountMe();
  const userBalancesStringify = JSON.stringify(account?.totalBalances);

  const [aggregatedBalances, setAggregatedBalances] = useState(
    new CurrencyMap<string>()
  );

  useEffect(() => {
    const updatedAggregatedBalances = new CurrencyMap<string>();
    if (account?.totalBalances) {
      for (const { coinSymbol, tokenSymbol, balance } of account.totalBalances)
        updatedAggregatedBalances.set(
          makeWalletCurrency(coinSymbol, tokenSymbol),
          balance
        );
      setAggregatedBalances(updatedAggregatedBalances);
    }
  }, [userBalancesStringify]);
  return aggregatedBalances;
}

export function useFocusCurrencySymbolsAndBalances() {
  const aggregatedBalances = useAggregatedBalances();
  const { delegatedFeeList } = useL1TxnDelegatedFees();
  useCryptoCurrencyBalances();
  const walletCurrency = useAppSelector(selectFocusCurrencyDetail);

  const isCurrencyTypeToken = typeof walletCurrency.token !== 'undefined';
  const nativeCoin = NetworkDictionary[walletCurrency.chain].nativeCoin;
  const delegatedFee =
    delegatedFeeList.find(
      (fee) =>
        fee.coinSymbol ===
        (TEST_TO_MAIN.get(walletCurrency.chain) || walletCurrency.chain)
    )?.delegatedFee ?? '0';

  return {
    isCurrencyTypeToken,
    chain: walletCurrency.chain,
    token: walletCurrency.token,
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
    delegatedFee: delegatedFee,
  };
}

export function useCryptoCurrencyBalances() {
  const aggregatedBalances = useAggregatedBalances();
  const chainBalances = new CurrencyMap<string>();
  const tokenBalances = new CurrencyMap<string>();

  aggregatedBalances.forEach((balance, key) => {
    const parsedKey = JSON.parse(key);
    if (parsedKey.token) {
      tokenBalances.set(parsedKey, balance);
    } else {
      chainBalances.set(parsedKey, balance);
    }
  });
  const sortedBalances = new Map([...chainBalances, ...tokenBalances]);
  return sortedBalances;
}
