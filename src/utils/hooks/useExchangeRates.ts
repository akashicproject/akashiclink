import type { IExchangeRate } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useExchangeRates = () => {
  const { data, error } = useSWR([`/exchange-rates`], fetcher);
  return {
    keys: (data || []) as IExchangeRate[],
    isLoading: !error && !data,
    isError: error,
  };
};
