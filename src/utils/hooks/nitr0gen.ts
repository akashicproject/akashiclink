import {
  type ITransactionProposalClientSideOtk,
  type ITransactionSettledResponse,
} from '@helium-pay/backend';

import { Nitr0genApi } from '../../utils/nitr0gen/nitr0gen-api';
import type { ActiveLedgerResponse } from '../nitr0gen/nitr0gen.interface';

export const useSendL2Transaction = () => {
  const nitr0genApi = new Nitr0genApi();

  const trigger = async (
    signedTransactionData: ITransactionProposalClientSideOtk
  ): Promise<ITransactionSettledResponse> => {
    try {
      const txHash = (
        await nitr0genApi.post<ActiveLedgerResponse>(
          signedTransactionData.signedTx
        )
      ).$umid;

      return {
        isSuccess: true,
        txHash,
      };
    } catch (error) {
      return {
        isSuccess: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
  return { trigger };
};
