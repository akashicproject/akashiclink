import {
  FeeDelegationStrategy,
  isCoinSymbol,
  type ITransactionProposalClientSideOtk,
  type ITransferNftResponse,
  OtkType,
  TransactionStatus,
  WalletType,
} from '@akashic/as-backend';
import { EthereumSymbol } from '@akashic/core-lib';
import {
  type IBaseAcTransaction,
  type ITransactionSettledResponse,
  prefixWithAS,
  TransactionLayer,
} from '@akashic/nitr0gen';
import { datadogRum } from '@datadog/browser-rum';

import { useAppDispatch } from '../../redux/app/hooks';
import { addLocalTransaction } from '../../redux/slices/localTransactionSlice';
import { getNitr0genApi } from '../nitr0gen/nitr0gen.utils';
import { HIDE_SMALL_BALANCES } from '../preference-keys';
import { useValueOfAmountInUSDT } from './useExchangeRates';
import { useAccountStorage } from './useLocalAccounts';

export const useSendL2Transaction = () => {
  const dispatch = useAppDispatch();
  const valueOfAmountInUSDT = useValueOfAmountInUSDT();
  const { activeAccount } = useAccountStorage();

  const trigger = async (
    signedTransactionData: ITransactionProposalClientSideOtk
  ): Promise<ITransactionSettledResponse> => {
    const nitr0genApi = await getNitr0genApi();
    const { response, error, nodeErrors } = await nitr0genApi.post(
      signedTransactionData.signedTx
    );
    if (error || !response) {
      const err = new Error(error);
      datadogRum.addError(err, { nodeErrors });
      throw err;
    }

    const hideSmallTransactions = localStorage.getItem(
      `CapacitorStorage.${HIDE_SMALL_BALANCES}`
    );

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
      ((hideSmallTransactions && usdtValue.gte(1)) || !hideSmallTransactions) &&
      activeAccount?.otkType === OtkType.PRIMARY
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
          l2TxnHash: response.$umid,
          initiatedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: TransactionStatus.CONFIRMED,
          layer: TransactionLayer.L2,
          amount,
          internalFee,
          initiatedToNonL2,
          usdtValue: usdtValue.toNumber(),
        })
      );
    }

    return {
      isPresigned: false,
      isSuccess: true,
      txHash: response.$umid,
    };
  };
  return { trigger };
};

export const useSendL1Transaction = () => {
  const dispatch = useAppDispatch();
  const valueOfAmountInUSDT = useValueOfAmountInUSDT();
  const { activeAccount } = useAccountStorage();

  const trigger = async (
    signedTransactionData: ITransactionProposalClientSideOtk
  ): Promise<ITransactionSettledResponse> => {
    const nitr0genApi = await getNitr0genApi();
    const { response, error, nodeErrors } = await nitr0genApi.post(
      signedTransactionData.signedTx
    );
    if (error || !response) {
      const err = new Error(error);
      datadogRum.addError(err, { nodeErrors });
      throw err;
    }

    const l2TxnHash = response.$umid;

    const hideSmallTransactions = localStorage.getItem(
      `CapacitorStorage.${HIDE_SMALL_BALANCES}`
    );

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
      ((hideSmallTransactions && usdtValue.gte(1)) || !hideSmallTransactions) &&
      activeAccount?.otkType === OtkType.PRIMARY
    ) {
      dispatch(
        addLocalTransaction({
          ...signedTransactionData,
          usdtValue: usdtValue.toNumber(),
          feeIsDelegated:
            signedTransactionData.feeDelegationStrategy ===
            FeeDelegationStrategy.Delegate,
          status: TransactionStatus.PENDING,
          initiatedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
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
      isPresigned: !!response.$streams.new.find((s) => s.name === 'l1.presign'),
      txHash: l2TxnHash,
    };
  };
  return { trigger };
};

export const useNftTransfer = () => {
  const trigger = async (
    signedTx: IBaseAcTransaction
  ): Promise<
    Omit<ITransferNftResponse, 'nftName' | 'ownerIdentity' | 'alias'>
  > => {
    const nitr0genApi = await getNitr0genApi();
    const { response, error, nodeErrors } = await nitr0genApi.post(signedTx);
    if (error || !response) {
      const err = new Error(error);
      datadogRum.addError(err, { nodeErrors });
      throw err;
    }

    return {
      txHash: response.$umid,
    };
  };
  return { trigger };
};

export const useUpdateAas = () => {
  const trigger = async (
    signedTx: IBaseAcTransaction
    // eslint-disable-next-line sonarjs/no-identical-functions
  ): Promise<{ txHash: string }> => {
    const nitr0genApi = await getNitr0genApi();
    const { response, error, nodeErrors } = await nitr0genApi.post(signedTx);

    if (error || !response) {
      const err = new Error(error);
      datadogRum.addError(err, { nodeErrors });
      throw err;
    }

    return {
      txHash: response.$umid,
    };
  };
  return { trigger };
};
