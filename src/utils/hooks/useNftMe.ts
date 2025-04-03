import type { INftResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useNftMe = () => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR(
    authenticated ? `/nft/me` : '',
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
    }
  );
  return {
    nfts: (data || []) as INftResponse[],
    isLoading: !error && !data,
    isError: error,
    mutateNftMe: mutate,
  };
};
