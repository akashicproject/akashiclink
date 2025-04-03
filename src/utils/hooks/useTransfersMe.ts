import { Preferences } from '@capacitor/preferences';
import type {
  IClientTransactionRecord,
  ITransactionRecord,
} from '@helium-pay/backend';
import { TransactionResult, TransactionStatus } from '@helium-pay/backend';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import { LAST_PAGE_LOCATION, REFRESH_INTERVAL } from '../../constants';
import { urls } from '../../constants/urls';
import { resetHistoryStackAndRedirect } from '../../history';
import fetcher from '../ownerFetcher';
import { useOwner } from './useOwner';

export const useTransfersMe = (params?: IClientTransactionRecord) => {
  const { authenticated } = useOwner();
  const { data, error, mutate } = useSWR(
    authenticated ? buildURL(`/key/transfers/me`, params) : '',
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
    }
  );

  /**
   * Request that 401s (auth cookie expired or not set) should chuck user
   * out to the landing page screen
   */
  if (error && error.status === 401) {
    Preferences.remove({
      key: LAST_PAGE_LOCATION,
    });
    resetHistoryStackAndRedirect(urls.akashicPay);
  }

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
