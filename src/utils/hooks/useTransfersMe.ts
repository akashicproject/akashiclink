import { Preferences } from '@capacitor/preferences';
import type {
  IClientTransactionRecord,
  ITransactionRecord,
} from '@helium-pay/backend';
import { TransactionResult, TransactionStatus } from '@helium-pay/backend';
import type { AxiosRequestConfig } from 'axios';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

const transferMeFetcher = async (path: string, config?: AxiosRequestConfig) => {
  const hideSmallTransactions = await Preferences.get({
    key: 'hide-small-balances',
  });
  const url = path
    ? buildURL(path, {
        hideSmallTransactions: hideSmallTransactions.value ?? true,
      })
    : '';
  return await fetcher(url, config);
};

export const useTransfersMe = (params?: IClientTransactionRecord) => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR(
    authenticated ? buildURL(`/key/transfers/me`, { ...params }) : '',
    transferMeFetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      keepPreviousData: false,
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
    mutateTransfersMe: mutate,
  };
};
