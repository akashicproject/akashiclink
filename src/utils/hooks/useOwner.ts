import type { IOwnerInfoResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useOwner = () => {
  const { data, error, mutate } = useSWR(`/owner/me`, fetcher, {
    shouldRetryOnError: false,
  });

  const owner = (data || {}) as IOwnerInfoResponse;

  return {
    owner,
    // TODO: Combine authenticated and isLoading
    authenticated: !!owner.ownerIdentity,
    isLoading: !error && !data,
    isError: error,
    mutateOwner: mutate,
  };
};
