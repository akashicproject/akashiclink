import type { IExchangeRate } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useExchangeRates = () => {
  const { data, error } = useSWR(
    `/public-api/owner/exchange-rates`,
    fetcher,
    {}
  );
  return {
    keys: (data || []) as IExchangeRate[],
    length: data ? Object.keys(data).length : 0,
    isLoading: !error && !data,
    isError: error,
  };
};
