import type { INftResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useNftMe = () => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR(
    authenticated ? `/nft/me` : '',
    fetcher,
    {}
  );
  return {
    nfts: (data || []) as INftResponse[],
    isLoading: !error && !data,
    isError: error,
    mutateNftMe: mutate,
  };
};
