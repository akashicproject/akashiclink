import type { IOwnerInfoResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useOwner = () => {
  const { data, error, mutate } = useSWR(`/owner/me`, fetcher);
  return {
    owner: (data || {}) as IOwnerInfoResponse,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
