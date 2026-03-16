import {
  type IFindWalletScreeningById,
  type IWalletScreeningByIdResponse,
} from '@akashic/as-backend';
import useSWRMutation from 'swr/mutation';

import { axiosBase } from '../axios-helper';
import { getCurrentTime } from '../currentUTCTime';
import { useAccountStorage } from './useLocalAccounts';
import { useSignMessage } from './useSignMessage';

export const useWalletScreenDetail = () => {
  const { activeAccount } = useAccountStorage();
  const signMessage = useSignMessage();

  const { trigger, data, error, isMutating } = useSWRMutation<
    IWalletScreeningByIdResponse,
    Error,
    string,
    IFindWalletScreeningById
  >(
    '/v0/wallet-screening/detail',
    async (url: string, { arg }: { arg: IFindWalletScreeningById }) => {
      const serverTime = await getCurrentTime();

      const payloadToSign = {
        identity: activeAccount?.identity ?? '',
        expires: serverTime + 60 * 1000,
        id: arg.id,
      };

      const signedMsg = signMessage(payloadToSign);

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
