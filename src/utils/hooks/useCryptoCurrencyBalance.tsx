import Big from 'big.js';

import type { IWalletCurrency } from '../../constants/currencies';
import { getChainExchangeRate } from '../chain';
import { useAggregatedBalances } from './useAggregatedBalances';
import { useExchangeRates } from './useExchangeRates';

export function useCryptoCurrencyBalance(walletCurrency: IWalletCurrency) {
  const { exchangeRates } = useExchangeRates();
  const aggregatedBalances = useAggregatedBalances();

  const balance = (aggregatedBalances.get(walletCurrency) as string) ?? '0';

  return {
    balance,
    balanceInUsd: Big(
      getChainExchangeRate(walletCurrency.chain, exchangeRates)
    ).times(balance ?? 0),
  };
}
