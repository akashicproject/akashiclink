import {
  type IFindWalletScreeningById,
  type IWalletScreeningByIdResponse,
} from '@akashic/as-backend';
import useSWRMutation from 'swr/mutation';

import { axiosBase } from '../axios-helper';
import { useAccountStorage } from './useLocalAccounts';
import { useSignAuthorizeActionMessage } from './useSignAuthorizeActionMessage';

export const useWalletScreenDetail = () => {
  const { activeAccount } = useAccountStorage();
  const signAuthorizeActionMessage = useSignAuthorizeActionMessage();

  const { trigger, data, error, isMutating } = useSWRMutation<
    IWalletScreeningByIdResponse,
    Error,
    string,
    IFindWalletScreeningById
  >(
    '/wallet-screening/detail',
    async (url: string, { arg }: { arg: IFindWalletScreeningById }) => {
      const payloadToSign = {
        identity: activeAccount?.identity ?? '',
        expires: Date.now() + 60 * 1000,
        id: arg.id,
      };

      const signedMsg = await signAuthorizeActionMessage(payloadToSign);

      const response = await axiosBase.post(url, {
        ...payloadToSign,
        signature: signedMsg.substring(2), //exclude 0x which is only required by WalletConnect
      });
      return response.data as IWalletScreeningByIdResponse;
    }
  );

  return {
    trigger,
    screening: data?.screening,
    error,
    isMutating,
  };
};
