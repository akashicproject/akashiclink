import type { INftResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useNftMe = () => {
  const { data, error, mutate } = useSWR([`/nft/me`], fetcher);

  return {
    nfts: (data || []) as INftResponse[],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
