import Big from 'big.js';

import { getChainExchangeRate } from '../chain';
import { useAccountBalances } from './useAccountBalances';
import { useExchangeRates } from './useExchangeRates';

export function useTotalCryptoCurrencyBalances() {
  const { exchangeRates, isLoading } = useExchangeRates();
  const { totalBalances, isLoading: isAccountLoading } = useAccountBalances();

  const totalBalanceInUsd = totalBalances?.reduce<Big>(
    (acc, balance) =>
      Big(acc).add(
        Big(balance.balance).times(
          getChainExchangeRate(balance.coinSymbol, exchangeRates)
        )
      ),
    Big('0')
  );

  return {
    isLoading: isLoading || isAccountLoading,
    totalBalanceInUsd,
  };
}
