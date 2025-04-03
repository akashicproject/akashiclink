import type { IOwnerBalancesResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useBalancesMe = () => {
  const { data, error } = useSWR(`/owner/agg-balances`, fetcher, {
    refreshInterval: 1000 * 10, // refreshing every 10
  });
  return {
    keys: (data || []) as IOwnerBalancesResponse[],
    isLoading: !error && !data,
    isError: error,
  };
};
