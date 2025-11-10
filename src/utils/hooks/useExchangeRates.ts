import {
  type CoinSymbol,
  type CryptoCurrencySymbol,
  type IExchangeRate,
} from '@helium-pay/backend';
import Big from 'big.js';
import useSWR from 'swr';

import { getMainnetEquivalent } from '../chain';
import { calculateInternalWithdrawalFee } from '../internal-fee';
import fetcher from '../ownerFetcher';

export const useExchangeRates = () => {
  const { data, ...response } = useSWR<IExchangeRate[], Error>(
    `/owner/exchange-rates`,
    fetcher
  );
  return {
    exchangeRates: data ?? [],
    ...response,
  };
};

export const useCalculateCurrencyL2WithdrawalFee = (
  coinSymbol: CoinSymbol,
  tokenSymbol?: CryptoCurrencySymbol
) => {
  const { exchangeRates } = useExchangeRates();

  return () => {
    return calculateInternalWithdrawalFee(
      exchangeRates,
      coinSymbol,
      tokenSymbol
    );
  };
};

export const useValueOfAmountInUSDT = () => {
  const { exchangeRates } = useExchangeRates();

  return (
    amount: string,
    coinSymbol: CoinSymbol,
    tokenSymbol?: CryptoCurrencySymbol
  ) => {
    const exchangeRate = Big(
      exchangeRates.find(
        (ex) =>
          !tokenSymbol && ex.coinSymbol === getMainnetEquivalent(coinSymbol)
      )?.price || 1
    );

    return Big(amount).mul(exchangeRate);
  };
};
