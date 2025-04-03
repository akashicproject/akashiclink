import type { IKeyExtended } from '@activeledger/sdk-bip39';
import { datadogRum } from '@datadog/browser-rum';
import {
  type CoinSymbol,
  type IBaseTransactionWithDbIndex,
  type IDiffconTx,
  type IKeyCreateTx,
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

export interface IKeysToCreate {
  coinSymbol: CoinSymbol;
  signedTx: IBaseTransactionWithDbIndex;
}

interface ICreateKeysResponse {
  readonly createdKeysToDiffcon: IKeysToDiffcon[];
}

interface IKeysToDiffcon {
  signedTx: IBaseTransactionWithDbIndex;
  coinSymbol: CoinSymbol;
  ledgerId: string;
}

interface IDiffconKeysResponse {
  failedDiffcon: IKeysToCreate[];
}

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

    // mainnets for production accounts and testnets for staging and local accounts
    const allowedChains = ALLOWED_NETWORKS;

    const keysToCreate: IKeysToCreate[] = [];

    // Loop through chains, for each create a transaction for a new key to be
    // signed by frontend
    for (const coinSymbol of allowedChains) {
      const signedTx = await nitr0genApi.keyCreateTransaction(
        { ...activateNewAccountData.otk, identity: otkIdentity },
        NetworkDictionary[coinSymbol].nitr0gen,
        coinSymbol
      );
      keysToCreate.push({ coinSymbol, signedTx });
    }

    return {
      identity: otkIdentity,
      keysToCreate,
    };
  };
  return { trigger };
};

export const useCreateKeys = () => {
  const nitr0genApi = new Nitr0genApi();

  const trigger = async (createKeysData: {
    keyCreationTxs: IKeyCreateTx[];
    otk: IKeyExtended;
  }): Promise<ICreateKeysResponse> => {
    const createdKeysToDiffcon: IKeysToDiffcon[] = [];

    // Create keys
    for (const keyCreationTx of createKeysData.keyCreationTxs) {
      const createdKey = await nitr0genApi.createFromSignedTx(
        keyCreationTx.coinSymbol,
        keyCreationTx.signedTx
      );
      // Create tx to diffcon created key
      const signedTx = await nitr0genApi.differentialConsensusTransaction(
        createKeysData.otk,
        { ...createdKey, id: createdKey.ledgerId }
      );
      // Nitr0gen doesn't return coinSymbol, have to add it here
      createdKeysToDiffcon.push({
        coinSymbol: keyCreationTx.coinSymbol,
        ledgerId: createdKey.ledgerId,
        signedTx,
      });
    }
    return { createdKeysToDiffcon };
  };
  return { trigger };
};

export const useDiffconKeys = () => {
  const nitr0genApi = new Nitr0genApi();

  const trigger = async (diffconKeysData: {
    keyDiffconTxs: IDiffconTx[];
  }): Promise<IDiffconKeysResponse> => {
    const failedDiffconKeys: IKeysToCreate[] = [];
    // Diffcon-check keys for user on nitr0gen
    for (const keyDiffconTx of diffconKeysData.keyDiffconTxs) {
      if (!(await nitr0genApi.diffconSignedTx(keyDiffconTx.signedTx))) {
        datadogRum.addError(
          new Error(`Key failed diffcon-check, ${keyDiffconTx.signedTx}`)
        );

        failedDiffconKeys.push({
          coinSymbol: keyDiffconTx.coinSymbol,
          signedTx: keyDiffconTx.signedTx,
        });
      }
    }
    // Return symbols which failed and transactions to try to re-create them
    return { failedDiffcon: failedDiffconKeys };
  };
  return { trigger };
};
