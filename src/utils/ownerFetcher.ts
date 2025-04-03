import type { AxiosRequestConfig } from 'axios';
import type { SWRConfiguration } from 'swr/dist/types';

import { axiosOwnerBase } from './axiosHelper';

// eslint-disable-next-line import/no-default-export
export default async function (path: string, config?: AxiosRequestConfig) {
  const { data } = await axiosOwnerBase.get(path, config);
  return data;
}

export const ReportSWRConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
  shouldRetryOnError: false,
  dedupingInterval: 1000,
  errorRetryInterval: 0,
};

export const AutoRefreshSWRConfig: SWRConfiguration = {
  refreshInterval: 10000,
};
