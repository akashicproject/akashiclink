import type { IKeyExtended } from '@activeledger/sdk-bip39';
import {
  type IBaseTransactionWithDbIndex,
  type IKeysToCreate,
  type ITransactionProposalClientSideOtk,
  type ITransactionSettledResponse,
  NetworkDictionary,
  TransactionLayer,
  TransactionStatus,
} from '@helium-pay/backend';

import { ALLOWED_NETWORKS } from '../../constants/currencies';
import { useAppDispatch } from '../../redux/app/hooks';
import { addLocalTransaction } from '../../redux/slices/localTransactionSlice';
import { Nitr0genApi } from '../../utils/nitr0gen/nitr0gen-api';
import { convertToFromASPrefix } from '../convert-as-prefix';
import type { ActiveLedgerResponse } from '../nitr0gen/nitr0gen.interface';

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

export const useActivateNewAccount = () => {
  const nitr0genApi = new Nitr0genApi();

  const trigger = async (activateNewAccountData: {
    otkOnboardTransaction: IBaseTransactionWithDbIndex;
    otk: IKeyExtended;
  }): Promise<{ identity: string; keysToCreate: IKeysToCreate[] }> => {
    const response = await nitr0genApi.post<ActiveLedgerResponse>(
      activateNewAccountData.otkOnboardTransaction
    );

    const ledgerId = response.$streams.new?.[0].id;
    if (!ledgerId) {
      throw new Error('Failed to generate identity for OTK');
    }

    const otkIdentity = convertToFromASPrefix(ledgerId, 'to');

    const fullOtk = { ...activateNewAccountData.otk, identity: otkIdentity };

    // mainnets for production accounts and testnets for staging and local accounts
    const allowedChains = ALLOWED_NETWORKS;

    const keysToCreate: IKeysToCreate[] = [];

    // Loop through chains, for each create a transaction for a new key to be
    // signed by frontend
    for (const coinSymbol of allowedChains) {
      const txToSign = await nitr0genApi.keyCreateTransaction(
        fullOtk,
        NetworkDictionary[coinSymbol].nitr0gen
      );
      keysToCreate.push({ coinSymbol, txToSign });
    }

    return {
      identity: otkIdentity,
      keysToCreate,
    };
  };
  return { trigger };
};
