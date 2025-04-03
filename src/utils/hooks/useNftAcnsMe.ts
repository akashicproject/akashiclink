import type { IAcnsResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useNftAcnsMe = () => {
  const { data, error, mutate } = useSWR([`/nft/acns/me`], fetcher);

  return {
    acns: (data || []) as IAcnsResponse[],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
