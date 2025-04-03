import type {
  INftTransactionRecord,
  INftTransactionRecordRequest,
} from '@helium-pay/backend';
import { TransactionStatus } from '@helium-pay/backend';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useNftTransfersMe = (params?: INftTransactionRecordRequest) => {
  const { data, error } = useSWR(
    buildURL(`/nft/transfers/me`, params),
    fetcher,
    {
      refreshInterval: 1000 * 10, // refresh interval every 10secs
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
  };
};
