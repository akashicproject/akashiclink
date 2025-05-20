import Big from 'big.js';

import type { IWalletCurrency } from '../../constants/currencies';
import { getChainExchangeRate } from '../chain';
import { useAccountBalances } from './useAccountBalances';
import { useExchangeRates } from './useExchangeRates';

export function useCryptoCurrencyBalance(walletCurrency: IWalletCurrency) {
  const { exchangeRates } = useExchangeRates();
  const { totalBalances } = useAccountBalances();

  const balance =
    totalBalances?.find(
      (c) =>
        `${c.coinSymbol}${c.tokenSymbol}` ===
        `${walletCurrency.chain}${walletCurrency.token}`
    )?.balance ?? '0';

  const balanceInUsd = Big(
    getChainExchangeRate(walletCurrency.chain, exchangeRates)
  ).times(balance ?? 0);

  return {
    balance,
    balanceInUsd,
  };
}
