import type {
  INftTransactionRecord,
  INftTransactionRecordRequest,
} from '@helium-pay/backend';
import { TransactionStatus } from '@helium-pay/backend';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useNftTransfersMe = (params?: INftTransactionRecordRequest) => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR(
    authenticated ? buildURL(`/nft/transfers/me`, params) : '',
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
    }
  );
  // HACK: filter out pending transactions
  const filteredData = data?.filter(
    (t: { status: TransactionStatus }) => t.status !== TransactionStatus.PENDING
  );
  return {
    transfers: (filteredData ?? []) as INftTransactionRecord[],
    isLoading: !error && !data,
    isError: error,
    mutateNftTransfersMe: mutate,
  };
};
