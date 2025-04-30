import { Preferences } from '@capacitor/preferences';
import { datadogRum } from '@datadog/browser-rum';
import {
  EthereumSymbol,
  FeeDelegationStrategy,
  type IBaseAcTransaction,
  isCoinSymbol,
  type ITransactionProposalClientSideOtk,
  type ITransferNftResponse,
  nftErrors,
  TransactionLayer,
  TransactionStatus,
  WalletType,
} from '@helium-pay/backend';

import { useAppDispatch } from '../../redux/app/hooks';
import { addLocalTransaction } from '../../redux/slices/localTransactionSlice';
import { prefixWithAS } from '../convert-as-prefix';
import type { ITransactionSettledResponse } from '../nitr0gen/nitr0gen.interface';
import { Nitr0genApi } from '../nitr0gen/nitr0gen-api';
import { HIDE_SMALL_BALANCES } from '../preference-keys';
import { useValueOfAmountInUSDT } from './useExchangeRates';

export const useSendL2Transaction = () => {
  const nitr0genApi = new Nitr0genApi();
  const dispatch = useAppDispatch();
  const valueOfAmountInUSDT = useValueOfAmountInUSDT();

  const trigger = async (
    signedTransactionData: ITransactionProposalClientSideOtk
  ): Promise<ITransactionSettledResponse> => {
    try {
      const txHash = (
        await nitr0genApi.sendTransaction(() =>
          nitr0genApi.sendSignedTx(signedTransactionData.signedTx)
        )
      ).$umid;

      const hideSmallTransactions = await Preferences.get({
        key: HIDE_SMALL_BALANCES,
      });

      const {
        fromAddress,
        toAddress,
        initiatedToNonL2,
        coinSymbol,
        tokenSymbol,
        amount,
        internalFee,
      } = signedTransactionData;

      const usdtValue = valueOfAmountInUSDT(amount, coinSymbol, tokenSymbol);

      // Only store locally if we are not hiding the transaction
      if (
        (hideSmallTransactions && usdtValue.gte(1)) ||
        !hideSmallTransactions
      ) {
        dispatch(
          addLocalTransaction({
            fromAddress,
            toAddress,
            senderIdentity: fromAddress,
            senderInfo: {
              identity: prefixWithAS(fromAddress),
              walletType: WalletType.AkashicLink, // Not necessarily accurate, but doesn't matter for temp local storage
            },
            receiverIdentity: toAddress,
            receiverInfo: {
              identity: prefixWithAS(toAddress),
              walletType: WalletType.AkashicLink, // Not necessarily accurate, but doesn't matter for temp local storage
            },
            coinSymbol,
            tokenSymbol,
            l2TxnHash: txHash,
            initiatedAt: new Date(),
            status: TransactionStatus.CONFIRMED,
            layer: TransactionLayer.L2,
            amount,
            internalFee,
            initiatedToNonL2,
          })
        );
      }

      return {
        isPresigned: false,
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

export const useSendL1Transaction = () => {
  const nitr0genApi = new Nitr0genApi();
  const dispatch = useAppDispatch();
  const valueOfAmountInUSDT = useValueOfAmountInUSDT();

  const trigger = async (
    signedTransactionData: ITransactionProposalClientSideOtk
  ): Promise<ITransactionSettledResponse> => {
    try {
      const result = await nitr0genApi.sendTransaction(() =>
        nitr0genApi.sendSignedTx(signedTransactionData.signedTx)
      );

      const l2TxnHash = result.$umid;

      const hideSmallTransactions = await Preferences.get({
        key: HIDE_SMALL_BALANCES,
      });

      const { identity } = signedTransactionData;

      const usdtValue = valueOfAmountInUSDT(
        signedTransactionData.amount,
        signedTransactionData.coinSymbol,
        signedTransactionData.tokenSymbol
      );

      // Only store locally if we are not hiding the transaction
      // And if not ETH/SEP as they get presigned and have the special "queued" transaction
      if (
        !isCoinSymbol(signedTransactionData.coinSymbol, EthereumSymbol) &&
        ((hideSmallTransactions && usdtValue.gte(1)) || !hideSmallTransactions)
      ) {
        dispatch(
          addLocalTransaction({
            ...signedTransactionData,
            feeIsDelegated:
              signedTransactionData.feeDelegationStrategy ===
              FeeDelegationStrategy.Delegate,
            status: TransactionStatus.PENDING,
            initiatedAt: new Date(),
            layer: TransactionLayer.L1,
            l2TxnHash,
            senderIdentity: identity,
            senderInfo: {
              identity: prefixWithAS(identity),
              walletType: WalletType.AkashicLink, // Not necessarily accurate, but doesn't matter for temp local storage
            },
          })
        );
      }

      return {
        isSuccess: true,
        isPresigned: !!result.$streams.new.find((s) => s.name === 'l1.presign'),
        txHash: l2TxnHash,
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
    signedTx: IBaseAcTransaction
  ): Promise<
    Omit<ITransferNftResponse, 'nftName' | 'ownerIdentity' | 'alias'>
  > => {
    const response = await nitr0genApi.sendSignedTx(signedTx);
    nitr0genApi.checkForNitr0genError(response);

    return {
      txHash: response.$umid,
    };
  };
  return { trigger };
};

export const useUpdateAas = () => {
  const nitr0genApi = new Nitr0genApi();

  const trigger = async (
    signedTx: IBaseAcTransaction
  ): Promise<{ txHash: string }> => {
    try {
      const response = await nitr0genApi.sendSignedTx(signedTx);
      nitr0genApi.checkForNitr0genError(response);

      return {
        txHash: response.$umid,
      };
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error(nftErrors.linkingAasFailed);
      datadogRum.addError(error);
      throw err;
    }
  };
  return { trigger };
};
