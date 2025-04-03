import { datadogRum } from '@datadog/browser-rum';
import {
  type ITransactionProposalClientSideOtk,
  type ITransactionSettledResponse,
  TransactionLayer,
  TransactionStatus,
  type ITransferNftUsingClientSideOtk,
  nftErrors,
  type ITransferNftResponse,
} from '@helium-pay/backend';

import { useAppDispatch } from '../../redux/app/hooks';
import { addLocalTransaction } from '../../redux/slices/localTransactionSlice';
import { Nitr0genApi } from '../../utils/nitr0gen/nitr0gen-api';

export const useSendL2Transaction = () => {
  const nitr0genApi = new Nitr0genApi();
  const dispatch = useAppDispatch();

  const trigger = async (
    signedTransactionData: ITransactionProposalClientSideOtk
  ): Promise<ITransactionSettledResponse> => {
    try {
      const txHash = (
        await nitr0genApi.sendTransaction(() =>
          nitr0genApi.sendSignedTx(signedTransactionData.signedTx)
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

export const useNftTransfer = () => {
  const nitr0genApi = new Nitr0genApi();

  const trigger = async (
    signedTransactionData: ITransferNftUsingClientSideOtk
  ): Promise<
    Omit<ITransferNftResponse, 'nftName' | 'ownerIdentity' | 'acnsAlias'>
  > => {
    const response = await nitr0genApi.sendSignedTx(
      signedTransactionData.signedTx
    );
    nitr0genApi.checkForNitr0genError(response);

    // Double-check nftStream and acnsStream
    if (!response.$streams || !response.$streams.updated) {
      const error = new Error(
        `${nftErrors.nftTransferError}, $streams is empty`
      );
      datadogRum.addError(error);
      throw error;
    }
    let updatedAcnsStreamId = null;
    for (const streamUpdated of response.$streams.updated) {
      if ('.acm' === streamUpdated.name) {
        updatedAcnsStreamId = streamUpdated.id;
      }
    }
    if (!updatedAcnsStreamId) {
      const error = new Error(
        `${nftErrors.nftTransferError}, updatedAcnsStreamId is empty`
      );
      datadogRum.addError(error);
      throw error;
    }

    return {
      txHash: response.$umid,
    };
  };
  return { trigger };
};
