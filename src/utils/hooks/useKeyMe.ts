import type { IKeyInfoResponse } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useKeyMe = () => {
  const { authenticated } = useOwner();
  const { data, ...response } = useSWR<IKeyInfoResponse[], Error>(
    authenticated ? `/key/me` : null,
    fetcher
  );

  // Dates come from backend as string so need to transform them here
  const dataWithDates = (data ?? []).map((d) => ({
    ...d,
    createdAt: new Date(d.createdAt),
  }));

  return { keys: dataWithDates, ...response };
};
