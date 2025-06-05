import Big from 'big.js';

import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../constants/currencies';
import { getChainExchangeRate } from '../chain';
import { useAccountBalances } from './useAccountBalances';
import { useExchangeRates } from './useExchangeRates';

export function useCryptoCurrencyBalancesList() {
  const { exchangeRates, isLoading } = useExchangeRates();
  const { totalBalances, isLoading: isAccountLoading } = useAccountBalances();

  const balances = SUPPORTED_CURRENCIES_FOR_EXTENSION.list.map((currency) => {
    const balance =
      totalBalances?.find(
        (c) =>
          `${c.coinSymbol}${c.tokenSymbol ?? ''}` ===
          `${currency.walletCurrency.chain}${currency.walletCurrency.token ?? ''}`
      )?.balance ?? '0';

    const balanceInUsd = Big(balance)
      .times(getChainExchangeRate(currency.walletCurrency, exchangeRates))
      .toFixed(6, Big.roundDown);

    return {
      ...currency.walletCurrency,
      balance,
      balanceInUsd,
    };
  });

  return {
    isLoading: isLoading || isAccountLoading,
    balances,
  };
}
