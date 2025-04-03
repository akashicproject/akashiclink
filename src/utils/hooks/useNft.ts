import type { ChainType, INftResponse } from '@helium-pay/backend';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useNft = (nftName: string, chainType: ChainType) => {
  const { data, error } = useSWR(
    buildURL('/nft', { nftName: nftName, chainType: chainType }),
    fetcher,
    {}
  );
  return {
    nft: (data || {}) as INftResponse,
    isLoading: !error && !data,
    isError: error,
  };
};
