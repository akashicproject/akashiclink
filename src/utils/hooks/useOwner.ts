import type { IOwnerInfoResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

/**
 * @param noReload will only request this is single time
 */
export const useOwner = (noReload = false) => {
  const { data, error, mutate } = useSWR(
    `/owner/me`,
    fetcher,
    noReload
      ? {
          refreshInterval: 0,
          revalidateOnFocus: false,
          shouldRetryOnError: false,
        }
      : {}
  );

  const owner = (data || {}) as IOwnerInfoResponse;

  return {
    owner,
    authenticated: Object.keys(owner).length !== 0,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
