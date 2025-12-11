import { type IWalletScreeningPaginatedAndCountResponse } from '@akashic/as-backend';
import useSWRInfinite from 'swr/infinite';

import { axiosBase } from '../axios-helper';
import { useAccountStorage } from './useLocalAccounts';
import { useSignAuthorizeActionMessage } from './useSignAuthorizeActionMessage';

export const useWalletScreenHistory = (limit = 10) => {
  const { activeAccount } = useAccountStorage();
  const signAuthorizeActionMessage = useSignAuthorizeActionMessage();

  const {
    data,
    mutate: mutateMyTransfers,
    isLoading,
    size,
    ...response
  } = useSWRInfinite<IWalletScreeningPaginatedAndCountResponse, Error>(
    (pageIndex) => pageIndex.toString(),
    async (pageIndex: string) => {
      const payloadToSign = {
        identity: activeAccount?.identity ?? '',
        expires: Date.now() + 60 * 1000,
        page: Number(pageIndex),
        limit: Number(limit),
      };

      const signedMsg = await signAuthorizeActionMessage(payloadToSign);

      const response = await axiosBase.post('/wallet-screening', {
        ...payloadToSign,
        signature: signedMsg.substring(2), //exclude 0x which is only required by WalletConnect
      });
      return response.data as IWalletScreeningPaginatedAndCountResponse;
    },
    {
      refreshInterval: 10000,
    }
  );

  const result = {
    ...data?.[0],
    screenings: data?.reduce(
      (prev, next) => {
        return [...prev, ...next.screenings];
      },
      [] as IWalletScreeningPaginatedAndCountResponse['screenings']
    ),
  };

  return {
    screenings: result?.screenings ?? [],
    count: result?.count,
    isLoading: isLoading,
    isLoadingMore: size > 0 && data && typeof data[size - 1] === 'undefined',
    size: size,
    mutateMyTransfers,
    ...response,
  };
};
