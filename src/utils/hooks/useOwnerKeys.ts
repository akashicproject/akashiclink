import type { IOwnerOldestKeysResponse } from '@akashic/as-backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useOwnerKeys = (address: string) => {
  const { data, ...response } = useSWR<IOwnerOldestKeysResponse[], Error>(
    `/v0/owner/keys?address=${address}`,
    fetcher,
    {
      errorRetryInterval: 10000,
    }
  );
  return { keys: data ?? [], ...response };
};
