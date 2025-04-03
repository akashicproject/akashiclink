import type {
  IClientTransactionRecord,
  ITransactionRecord,
} from '@helium-pay/backend';
import { TransactionStatus } from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useTransfersMe = (params?: IClientTransactionRecord) => {
  const { data, error } = useSWR(
    [
      `/key/transfers/me`,
      {
        params,
      },
    ],
    fetcher
  );
  // HACK: filter out pending transactions
  const filteredData = ((data || []) as ITransactionRecord[]).filter(
    (t) => t.status !== TransactionStatus.PENDING
  );
  return {
    transfers: filteredData,
    isLoading: !error && !data,
    isError: error,
  };
};
