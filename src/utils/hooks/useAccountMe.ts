import type { IOwnerDetailsResponse } from '@akashic/as-backend';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useAccountStorage } from './useLocalAccounts';

export const useAccountMe = () => {
  const { activeAccount, cacheOtk } = useAccountStorage();
  return useSWR<IOwnerDetailsResponse>(
    activeAccount?.identity && cacheOtk
      ? `/v0/owner/details?address=${activeAccount?.identity}`
      : null,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  );
};
