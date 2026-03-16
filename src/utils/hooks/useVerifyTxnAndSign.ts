import {
  type FeeDelegationStrategy,
  type IWithdrawalProposal,
  L2Regex,
} from '@akashic/as-backend';
import { CoinSymbol, CryptoCurrencySymbol } from '@akashic/core-lib';
import {
  type IBaseAcTransaction,
  type L2TxDetail,
  TransactionLayer,
} from '@akashic/nitr0gen';

import type {
  ITransactionForSigning,
  ValidatedAddressPair,
} from '../../components/send/send-form/types';
import { OwnersAPI } from '../api';
import {
  convertFromSmallestUnit,
  convertObjectCurrencies,
  convertToSmallestUnit,
} from '../currency';
import { AppError } from '../error-utils';
import { calculateInternalWithdrawalFee } from '../internal-fee';
import { getNitr0genApi } from '../nitr0gen/nitr0gen.utils';
import { useAccountMe } from './useAccountMe';
import { useExchangeRates } from './useExchangeRates';
import { useAccountStorage } from './useLocalAccounts';

export const mapUSDTToTether = (
  coinSymbol: CoinSymbol,
  tokenSymbol?: CryptoCurrencySymbol
) => {
  if (
    tokenSymbol === CryptoCurrencySymbol.USDT &&
    coinSymbol === CoinSymbol.Tron_Shasta
  ) {
    return CryptoCurrencySymbol.TETHER;
  }
  return tokenSymbol ?? undefined;
};

export interface UseVerifyAndSignResponse {
  /** The signed txn sent to the chain. NOTE: the monetary amounts are in the
   * smallest, indivisible units, which is not typical for client code. */
  signedTxn: IBaseAcTransaction;
  /** The txn with extra contextual data, useful for caching */
  txn: ITransactionForSigning;
  /** The delegated fee, if any. In UI units (in contrast to the txn) */
  delegatedFee?: string;
  /** True if the destination address has not been used before (backend-provided). */
  isFirstTimeInteractionWithAddress?: boolean;
}

export const useVerifyTxnAndSign = () => {
  const { activeAccount } = useAccountStorage();
  const { exchangeRates } = useExchangeRates();
  const { data: account } = useAccountMe();
  const { cacheOtk } = useAccountStorage();

  return async (
    validatedAddressPair: ValidatedAddressPair,
    amount: string,
    coinSymbol: CoinSymbol,
    tokenSymbol?: CryptoCurrencySymbol,
    feeDelegationStrategy?: FeeDelegationStrategy,
    approvedStream?: string,
    referenceId?: string
  ): Promise<UseVerifyAndSignResponse> => {
    const isL2 = L2Regex.exec(validatedAddressPair?.convertedToAddress);
    const nitr0genApi = await getNitr0genApi();

    if (!cacheOtk || !activeAccount || !account) {
      throw new Error('cache not found');
    }

    if (isL2) {
      const l2TransactionData: L2TxDetail = {
        initiatedToNonL2: !L2Regex.exec(validatedAddressPair.userInputToAddress)
          ? validatedAddressPair.userInputToAddress
          : undefined,
        toAddress: validatedAddressPair.convertedToAddress,
        initiatedToL1LedgerId: validatedAddressPair.initiatedToL1LedgerId,
        // Backend accepts "normal" units, so we don't convert
        amount,
        coinSymbol,
        tokenSymbol,
      };
      if (activeAccount.identity === l2TransactionData.toAddress)
        throw new Error(AppError.NoSelfSend);

      let txBody = await nitr0genApi.signTx(
        nitr0genApi.l2Transaction(
          cacheOtk,
          // AC needs smallest units, so we convert
          convertObjectCurrencies(l2TransactionData, convertToSmallestUnit),
          account.isFxBp,
          approvedStream,
          referenceId
        ),
        cacheOtk
      );
      // add check for FX Bp
      if (account.isFxBp) {
        // sign transaction from backend
        const { preparedTxn } = await OwnersAPI.prepareL2Txn({
          signedTx: txBody,
        });
        txBody = preparedTxn;
      }

      const txn: ITransactionForSigning = {
        ...l2TransactionData,
        identity: activeAccount.identity,
        internalFee: {
          withdraw: calculateInternalWithdrawalFee(
            exchangeRates,
            coinSymbol,
            tokenSymbol
          ),
        },
        layer: TransactionLayer.L2,
        fromAddress: activeAccount.identity,
        txToSign: txBody,
      };

      return {
        txn,
        signedTxn: txBody,
        isFirstTimeInteractionWithAddress: false,
      };
    }

    const transactionData: IWithdrawalProposal = {
      identity: activeAccount.identity,
      toAddress: validatedAddressPair.convertedToAddress,
      // Backend accepts "normal" units, so we don't convert
      amount,
      coinSymbol,
      tokenSymbol,
      feeDelegationStrategy,
      approvedStream,
      referenceId,
    };

    const {
      preparedTxn,
      fromAddress,
      delegatedFee,
      isFirstTimeInteractionWithAddress,
    } = await OwnersAPI.prepareL1Txn(transactionData);
    const signedTxn = await nitr0genApi.signTx(preparedTxn, cacheOtk);
    const uiFeesEstimate = convertFromSmallestUnit(
      preparedTxn.$tx.metadata?.feesEstimate ?? '0',
      coinSymbol
    );
    const txn: ITransactionForSigning = {
      identity: activeAccount.identity,
      fromAddress,
      toAddress: validatedAddressPair.convertedToAddress,
      amount,
      coinSymbol,
      tokenSymbol,
      feesEstimate: uiFeesEstimate,
      layer: TransactionLayer.L1,
      txToSign: signedTxn,
      internalFee: {
        withdraw: delegatedFee,
      },
    };

    return { txn, signedTxn, delegatedFee, isFirstTimeInteractionWithAddress };
  };
};
