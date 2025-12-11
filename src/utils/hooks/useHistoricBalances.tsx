import type { IOwnerHistoricBalancesResponse } from '@akashic/as-backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';
import { useAccountStorage } from './useLocalAccounts';

export const useHistoricBalances = ({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) => {
  const { activeAccount } = useAccountStorage();

  const queryParams = new URLSearchParams({
    ...(startDate ? { startDate: startDate?.toString() } : {}),
    ...(endDate ? { endDate: endDate?.toString() } : {}),
  });

  const { data, ...response } = useSWR<IOwnerHistoricBalancesResponse, Error>(
    `/owner/historic-balances?address=${activeAccount?.identity}&${queryParams.toString()}`,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every 60 seconds
    }
  );
  return {
    historicBalances: data?.historicBalances,
    ...response,
  };
};
