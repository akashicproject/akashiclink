import {
  type ITransactionProposalClientSideOtk,
  type ITransactionSettledResponse,
  TransactionLayer,
  TransactionStatus,
} from '@helium-pay/backend';

import { useAppDispatch } from '../../redux/app/hooks';
import { addLocalTransaction } from '../../redux/slices/localTransactionSlice';
import { Nitr0genApi } from '../../utils/nitr0gen/nitr0gen-api';
import type { ActiveLedgerResponse } from '../nitr0gen/nitr0gen.interface';

export const useSendL2Transaction = () => {
  const nitr0genApi = new Nitr0genApi();
  const dispatch = useAppDispatch();

  const trigger = async (
    signedTransactionData: ITransactionProposalClientSideOtk
  ): Promise<ITransactionSettledResponse> => {
    try {
      const txHash = (
        await nitr0genApi.post<ActiveLedgerResponse>(
          signedTransactionData.signedTx
        )
      ).$umid;

      const {
        fromAddress,
        toAddress,
        initiatedToNonL2,
        coinSymbol,
        tokenSymbol,
        amount,
        internalFee,
      } = signedTransactionData;
      dispatch(
        addLocalTransaction({
          fromAddress,
          toAddress,
          senderIdentity: fromAddress,
          receiverIdentity: toAddress,
          coinSymbol,
          tokenSymbol,
          l2TxnHash: txHash,
          date: new Date(),
          status: TransactionStatus.CONFIRMED,
          layer: TransactionLayer.L2,
          amount,
          internalFee,
          initiatedToNonL2,
        })
      );

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
