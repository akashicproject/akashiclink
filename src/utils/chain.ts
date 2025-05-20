import {
  type CoinSymbol,
  type IExchangeRate,
  TEST_TO_MAIN,
} from '@helium-pay/backend';

import { type IWalletCurrency } from '../constants/currencies';
export const getMainnetEquivalent = (coinSymbol: CoinSymbol) => {
  return TEST_TO_MAIN.get(coinSymbol) ?? coinSymbol;
};

export const getChainExchangeRate = (
  walletCurrency: IWalletCurrency,
  exchangeRates: IExchangeRate[]
) => {
  return (
    exchangeRates.find(
      (ex: IExchangeRate) =>
        !walletCurrency.token &&
        ex.coinSymbol === getMainnetEquivalent(walletCurrency.chain)
    )?.price ?? 1
  );
};
