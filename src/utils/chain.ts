import {
  type CoinSymbol,
  type IExchangeRate,
  TEST_TO_MAIN,
} from '@helium-pay/backend';
export const getMainnetEquivalent = (coinSymbol: CoinSymbol) => {
  return TEST_TO_MAIN.get(coinSymbol) ?? coinSymbol;
};

export const getChainExchangeRate = (
  coinSymbol: CoinSymbol,
  exchangeRates: IExchangeRate[]
) => {
  return (
    exchangeRates.find(
      (ex: IExchangeRate) => ex.coinSymbol === getMainnetEquivalent(coinSymbol)
    )?.price ?? 0
  );
};
