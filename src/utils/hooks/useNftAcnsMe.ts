import type { AcnsResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useNftAcnsMe = () => {
  const { data, error } = useSWR([`/nft/acns/me`], fetcher);

  return {
    acns: (data || []) as AcnsResponse[],
    isLoading: !error && !data,
    isError: error,
  };
};
