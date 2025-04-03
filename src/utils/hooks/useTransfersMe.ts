import type {
  IClientTransactionRecord,
  ITransactionRecord,
} from '@helium-pay/backend';
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
  return {
    transfers: (data || []) as ITransactionRecord[],
    isLoading: !error && !data,
    isError: error,
  };
};
