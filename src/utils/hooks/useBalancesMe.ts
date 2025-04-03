import type { IOwnerBalancesResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useBalancesMe = () => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR(
    authenticated ? `/owner/agg-balances` : '',
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
    }
  );
  return {
    keys: (data || []) as IOwnerBalancesResponse[],
    isLoading: !error && !data,
    isError: error,
    mutateBalancesMe: mutate,
  };
};
