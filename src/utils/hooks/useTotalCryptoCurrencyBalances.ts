import Big from 'big.js';

import { getChainExchangeRate } from '../chain';
import { useAccountBalances } from './useAccountBalances';
import { useExchangeRates } from './useExchangeRates';
import { useFiatCurrencyDisplay } from './useFiatCurrencyDisplay';
import { useFiatExchangeRates } from './useFiatExchangeRates';

export function useTotalCryptoCurrencyBalances() {
  const { exchangeRates, isLoading } = useExchangeRates();
  const { totalBalances, isLoading: isAccountLoading } = useAccountBalances();

  const { fiatCurrencySymbol } = useFiatCurrencyDisplay();

  const { exchangeRate: fiatExchangeRate } =
    useFiatExchangeRates(fiatCurrencySymbol);

  const totalBalanceInUsd = totalBalances?.reduce<Big>(
    (acc, balance) =>
      Big(acc).add(
        Big(balance.balance)
          .times(
            getChainExchangeRate(
              {
                coinSymbol: balance.coinSymbol,
                tokenSymbol: balance.tokenSymbol,
              },
              exchangeRates
            )
          )
          .toFixed(6, Big.roundDown)
      ),
    Big('0')
  );

  return {
    isLoading: isLoading || isAccountLoading,
    totalBalanceInUsd,
    totalBalanceInFiat: fiatExchangeRate?.USDT
      ? Big(totalBalanceInUsd ?? '0').times(fiatExchangeRate?.USDT ?? 1)
      : undefined,
  };
}
