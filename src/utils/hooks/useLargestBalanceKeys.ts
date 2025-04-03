import type {
  ICoinSymbols,
  ILargestBalanceKeysResponse,
} from '@helium-pay/backend';
import { keyError } from '@helium-pay/backend';
import type { AxiosRequestConfig } from 'axios';
import buildURL from 'axios/unsafe/helpers/buildURL';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useLargestBalanceKeys = (params?: ICoinSymbols) => {
  const { data, error } = useSWR(
    buildURL(`/key/largest-balance`, params),
    async (path: string, config?: AxiosRequestConfig) => {
      const data = await fetcher(path, config);

      return data.filter(
        (key: { address: string }) => key.address !== keyError.notExistInNetwork
      );
    },
    {}
  );
  return {
    keys: (data || []) as ILargestBalanceKeysResponse[],
    isLoading: !error && !data,
    isError: error,
  };
};
