import {} from '@akashic/as-backend';
import type { CoinSymbol, CryptoCurrencySymbol } from '@akashic/core-lib';
import Big from 'big.js';

import { getChainExchangeRate } from '../chain';
import { useAccountBalances } from './useAccountBalances';
import { useExchangeRates } from './useExchangeRates';
import { useFiatCurrencyDisplay } from './useFiatCurrencyDisplay';
import { useFiatExchangeRates } from './useFiatExchangeRates';

export function useCryptoCurrencyBalance(
  coinSymbol: CoinSymbol,
  tokenSymbol?: CryptoCurrencySymbol
) {
  const { exchangeRates } = useExchangeRates();
  const { totalBalances } = useAccountBalances();

  const { fiatCurrencySymbol } = useFiatCurrencyDisplay();

  const { exchangeRate: fiatExchangeRate } =
    useFiatExchangeRates(fiatCurrencySymbol);

  const balance =
    totalBalances?.find(
      (c) =>
        `${c.coinSymbol}${c.tokenSymbol ?? ''}` ===
        `${coinSymbol}${tokenSymbol ?? ''}`
    )?.balance ?? '0';

  const balanceInUsd = Big(balance)
    .times(getChainExchangeRate({ coinSymbol, tokenSymbol }, exchangeRates))
    .toFixed(6, Big.roundDown); // prevent issues when balance is too small e.g. = '0.000001'

  const balanceInFiat = fiatExchangeRate?.USDT
    ? Big(balanceInUsd ?? '0')
        .times(fiatExchangeRate?.USDT ?? 1)
        .toFixed(6, Big.roundDown)
    : undefined;

  return {
    balance,
    balanceInUsd,
    balanceInFiat,
  };
}
