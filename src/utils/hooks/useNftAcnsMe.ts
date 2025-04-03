import type { IAcnsResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useNftAcnsMe = () => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR(
    authenticated ? `/nft/acns/me` : '',
    fetcher,
    {}
  );

  return {
    acns: (data || []) as IAcnsResponse[],
    isLoading: !error && !data,
    isError: error,
    mutateNftAcnsMe: mutate,
  };
};
