import {
  type ITxnByPresignedUmidRequest,
  type ITxnByPresignedUmidResponse,
} from '@helium-pay/backend';
import useSWRMutation from 'swr/mutation';

import { axiosBase } from '../axios-helper';

export const useTxnPresigned = () => {
  return useSWRMutation(
    `/transactions/presigned`,
    async (url: string, { arg }: { arg: ITxnByPresignedUmidRequest }) => {
      const { preSignedUmid } = arg;
      const params = new URLSearchParams({ preSignedUmid });
      const response = await axiosBase.get<ITxnByPresignedUmidResponse>(
        `${url}?${params.toString()}`
      );
      return response.data;
    }
  );
};
