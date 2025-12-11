import {
  type CoinSymbol,
  type CryptoCurrency,
  type IExchangeRate,
  TEST_TO_MAIN,
} from '@akashic/as-backend';

export const getMainnetEquivalent = (coinSymbol: CoinSymbol) => {
  return TEST_TO_MAIN.get(coinSymbol) ?? coinSymbol;
};

export const getChainExchangeRate = (
  currency: CryptoCurrency,
  exchangeRates: IExchangeRate[]
) => {
  return (
    exchangeRates.find(
      (ex: IExchangeRate) =>
        !currency.tokenSymbol &&
        ex.coinSymbol === getMainnetEquivalent(currency.coinSymbol)
    )?.price ?? 1
  );
};
