import {
  type CoinSymbol,
  type CryptoCurrencySymbol,
} from '@helium-pay/backend';
import Big from 'big.js';

import { getChainExchangeRate } from '../chain';
import { useAccountBalances } from './useAccountBalances';
import { useExchangeRates } from './useExchangeRates';

export function useCryptoCurrencyBalance(
  coinSymbol: CoinSymbol,
  tokenSymbol?: CryptoCurrencySymbol
) {
  const { exchangeRates } = useExchangeRates();
  const { totalBalances } = useAccountBalances();

  const balance =
    totalBalances?.find(
      (c) =>
        `${c.coinSymbol}${c.tokenSymbol ?? ''}` ===
        `${coinSymbol}${tokenSymbol ?? ''}`
    )?.balance ?? '0';

  const balanceInUsd = Big(balance)
    .times(getChainExchangeRate({ coinSymbol, tokenSymbol }, exchangeRates))
    .toFixed(6, Big.roundDown); // prevent issues when balance is too small e.g. = '0.000001'

  return {
    balance,
    balanceInUsd,
  };
}
