import type { IConfigResponse } from '@helium-pay/backend';
import { isPlatform } from '@ionic/react';
import useSWR from 'swr';

import fetcher from '../ownerFetcher';

export const useConfig = () => {
  const { data, error, mutate } = useSWR(`/config`, fetcher, {});
  const config = (data || {}) as IConfigResponse;
  return {
    config: isPlatform('ios')
      ? {
          awMinVersion: config.awMinVersionIos,
          awLatestVersion: config.awLatestVersionIos,
          awUrl: config.awUrlIos,
        }
      : isPlatform('android')
      ? {
          awMinVersion: config.awMinVersionAndroid,
          awLatestVersion: config.awLatestVersionAndroid,
          awUrl: config.awUrlAndroid,
        }
      : {
          awMinVersion: config.awMinVersionExtension,
          awLatestVersion: config.awLatestVersionExtension,
          awUrl: config.awUrlExtension,
        },
    isLoading: !error && !data,
    isError: error,
    mutateConfig: mutate,
  };
};
