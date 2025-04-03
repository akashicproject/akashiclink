import type { IOwnerBalancesResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useBalancesMe = () => {
  const { authenticated } = useOwner();
  const {
    data,
    mutate: mutateBalancesMe,
    ...response
  } = useSWR<IOwnerBalancesResponse[], Error>(
    authenticated ? `/owner/agg-balances` : null,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  );
  return {
    keys: data ?? [],
    mutateBalancesMe,
    ...response,
  };
};
