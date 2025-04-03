import type { INft } from '@helium-pay/backend';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useNft = (nftName: string) => {
  const { data, error } = useSWR(
    buildURL('/nft', { name: nftName }),
    fetcher,
    {}
  );
  return {
    nft: (data || {}) as INft,
    isLoading: !error && !data,
    isError: error,
  };
};
