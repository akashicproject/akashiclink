import {
  type CryptoCurrencySymbol,
  type FiatCurrencySymbol,
} from '@akashic/as-backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useFiatExchangeRates = (requestedCurrency: FiatCurrencySymbol) => {
  const { data, ...response } = useSWR<
    Record<CryptoCurrencySymbol, string>,
    Error
  >(`/exchange-rate/${requestedCurrency}`, fetcher);
  return {
    exchangeRate: data,
    ...response,
  };
};
