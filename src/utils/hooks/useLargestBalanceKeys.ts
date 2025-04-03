import type {
  ICoinSymbols,
  ILargestBalanceKeysResponse,
} from '@helium-pay/backend';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useLargestBalanceKeys = (params?: ICoinSymbols) => {
  const { data, error } = useSWR(
    [
      `/key/largest-balance`,
      {
        params,
      },
    ],
    fetcher
  );
  return {
    keys: (data || []) as ILargestBalanceKeysResponse[],
    isLoading: !error && !data,
    isError: error,
  };
};
