import { Preferences } from '@capacitor/preferences';
import type {
  IClientTransactionRecord,
  IOwnerTransactionsResponse,
} from '@helium-pay/backend';
import {
  TransactionResult,
  TransactionStatus,
  TransactionType,
} from '@helium-pay/backend';
import type { AxiosRequestConfig } from 'axios';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import { REFRESH_INTERVAL } from '../../constants';
import fetcher from '../ownerFetcher';
import { useAccountStorage } from './useLocalAccounts';

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
  const { activeAccount } = useAccountStorage();
  const {
    data,
    mutate: mutateTransfersMe,
    ...response
  } = useSWR<IOwnerTransactionsResponse, Error>(
    activeAccount?.identity
      ? buildURL(`/public-api/owner/transactions`, {
          identity: activeAccount?.identity,
          ...params,
        })
      : null,
    transferMeFetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      keepPreviousData: false,
    }
  );

  const transformedTransfers = (data?.transactions ?? []).map((d) => ({
    ...d,
    // remove trailing zeros from amounts
    amount: d.amount.replace(/\.*0+$/, ''),
    feesPaid: d.feesPaid?.replace(/\.*0+$/, ''),
    // Dates come from backend as string so need to transform them here
    date: new Date(d.date),
    // HACK: set transactions with result = Failure to status = Failed
    // temporary solution until we finish the status code
    ...(d.result === TransactionResult.FAILURE && {
      status: TransactionStatus.FAILED,
    }),
    // Condition to determine the transaction type: if it's senderIdentity then withdraw else deposit
    type:
      d.senderIdentity === activeAccount?.identity
        ? TransactionType.WITHDRAWAL
        : TransactionType.DEPOSIT,
    // Checking if the tokenSymbol field exists and is not null and status is 'confirmed'
    // Otherwise, keep the existing value of the 'result'. Hence there is no result so it won't be in records.
    ...(d.tokenSymbol &&
      d.status === TransactionStatus.CONFIRMED && {
        result: TransactionResult.SUCCESS,
      }),
  }));

  return {
    transfers: transformedTransfers,
    mutateTransfersMe,
    ...response,
  };
};
