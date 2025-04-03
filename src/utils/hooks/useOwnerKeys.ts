import type { IOwnerOldestKeysResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useOwnerKeys = (address: string) => {
  const { data, error } = useSWR(
    `/public-api/owner/keys?address=${address}`,
    fetcher,
    {}
  );
  return {
    keys: (data || []) as IOwnerOldestKeysResponse[],
    isLoading: !error && !data,
    isError: error,
  };
};
