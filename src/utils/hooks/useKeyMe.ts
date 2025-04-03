import type { IKeyInfoResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useKeyMe = () => {
  const { data, error } = useSWR(`/key/me`, fetcher, {});

  // Dates come from backend as string so need to transform them here
  const dataWithDates = ((data || []) as IKeyInfoResponse[]).map((d) => ({
    ...d,
    createdAt: new Date(d.createdAt),
  }));

  return {
    keys: dataWithDates,
    isLoading: !error && !data,
    isError: error,
  };
};
