import type { INft } from '@helium-pay/backend';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useNftMe = () => {
  const { authenticated } = useOwner();
  const {
    data,
    mutate: mutateNftMe,
    ...response
  } = useSWR<INft[], Error>(authenticated ? `/nft/me` : null, fetcher, {
    refreshInterval: REFRESH_INTERVAL,
  });
  return { nfts: data ?? [], mutateNftMe, ...response };
};
