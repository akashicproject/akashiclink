import type {
  IClientTransactionRecord,
  ITransactionRecord,
} from '@helium-pay/backend';
import { TransactionResult, TransactionStatus } from '@helium-pay/backend';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useTransfersMe = (params?: IClientTransactionRecord) => {
  const { data, error } = useSWR(
    buildURL(`/key/transfers/me`, params),
    fetcher,
    {
      refreshInterval: 1000 * 60, // refresh interval every 60secs
    }
  );
  // Dates come from backend as string so need to transform them here
  // also, remove trailing zeros from amounts
  const dataWithDates = ((data || []) as ITransactionRecord[]).map((d) => ({
    ...d,
    amount: d.amount.replace(/\.*0+$/, ''),
    feesPaid: d.feesPaid?.replace(/\.*0+$/, ''),
    date: new Date(d.date),
  }));

  // HACK: set transactions with result = Failure to status = Failed
  // temporary solution until we finish the status code
  const transformedFails = dataWithDates.map((t) =>
    t.result === TransactionResult.FAILURE
      ? { ...t, status: TransactionStatus.FAILED }
      : t
  );
  return {
    transfers: transformedFails,
    isLoading: !error && !data,
    isError: error,
  };
};
