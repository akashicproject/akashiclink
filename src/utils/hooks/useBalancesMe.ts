import type { IOwnerBalancesResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useBalancesMe = () => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR(
    authenticated ? `/owner/agg-balances` : '',
    fetcher,
    {
      refreshInterval: 1000 * 10, // refreshing every 10
    }
  );
  return {
    keys: (data || []) as IOwnerBalancesResponse[],
    isLoading: !error && !data,
    isError: error,
    mutateBalancesMe: mutate,
  };
};
