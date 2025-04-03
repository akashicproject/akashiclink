import { useEffect, useState } from 'react';

import { CurrencyMap, makeWalletCurrency } from '../supported-currencies';
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
