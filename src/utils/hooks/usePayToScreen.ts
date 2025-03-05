import {
  type IPayFeeAndScreenWallet,
  type IWalletScreening,
} from '@helium-pay/backend';
import useSWRMutation from 'swr/mutation';

import { axiosBase } from '../axios-helper';

export const usePayToScreen = () => {
  const { trigger, data, error, isMutating } = useSWRMutation<
    IWalletScreening,
    Error,
    string,
    IPayFeeAndScreenWallet
  >(
    '/wallet-screening/pay-to-screen',
    async (url: string, { arg }: { arg: IPayFeeAndScreenWallet }) => {
      const response = await axiosBase.post(url, arg);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    }
  );

  return {
    trigger,
    data,
    error,
    isMutating,
  };
};
