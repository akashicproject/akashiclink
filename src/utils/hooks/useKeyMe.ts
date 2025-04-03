import type { IKeyInfoResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useKeyMe = () => {
  const { data, error } = useSWR([`/key/me`], fetcher);
  return {
    keys: (data || []) as IKeyInfoResponse[],
    isLoading: !error && !data,
    isError: error,
  };
};
