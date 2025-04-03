import type { IOwnerInfoResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useOwner = () => {
  const { data, error, mutate } = useSWR(`/owner/me`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 1,
    errorRetryInterval: 1000,
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
