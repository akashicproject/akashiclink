import type { INft } from '@helium-pay/backend';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useNftMe = () => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR<INft[]>(
    authenticated ? `/nft/me` : '',
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
    }
  );
  return {
    nfts: (data || []) as INft[],
    isLoading: !error && !data,
    isError: error,
    mutateNftMe: mutate,
  };
};
