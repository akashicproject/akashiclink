import { type FiatCurrencySymbol } from '@akashic/as-backend';
import type { CryptoCurrencySymbol } from '@akashic/core-lib';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useFiatExchangeRates = (requestedCurrency: FiatCurrencySymbol) => {
  const { data, ...response } = useSWR<
    Record<CryptoCurrencySymbol, string>,
    Error
  >(`/v0/exchange-rate/${requestedCurrency}`, fetcher);
  return {
    exchangeRate: data,
    ...response,
  };
};
