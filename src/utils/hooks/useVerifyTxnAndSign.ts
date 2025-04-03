import { datadogRum } from '@datadog/browser-rum';
import type { CoinSymbol, CurrencySymbol } from '@helium-pay/backend';
import {
  type IWithdrawalProposal,
  keyError,
  L2Regex,
  TransactionLayer,
} from '@helium-pay/backend';

import type { ValidatedAddressPair } from '../../components/send-deposit/send-form/types';
import { useAppSelector } from '../../redux/app/hooks';
import { selectFocusCurrencyDetail } from '../../redux/slices/preferenceSlice';
import { OwnersAPI } from '../api';
import { convertObjectCurrencies, convertToDecimals } from '../currency';
import { calculateInternalWithdrawalFee } from '../internal-fee';
import type {
  ITransactionForSigning,
  L2TxDetail,
} from '../nitr0gen/nitr0gen.interface';
import { Nitr0genApi, signTxBody } from '../nitr0gen/nitr0gen-api';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';
import { useAccountMe } from './useAccountMe';
import { useExchangeRates } from './useExchangeRates';
import { useAccountStorage } from './useLocalAccounts';

export const useVerifyTxnAndSign = () => {
  const { chain, token } = useAppSelector(selectFocusCurrencyDetail);
  const { activeAccount } = useAccountStorage();
  const { exchangeRates } = useExchangeRates();
  const { data: account } = useAccountMe();
  const { cacheOtk } = useAccountStorage();

  return async (
    validatedAddressPair: ValidatedAddressPair,
    amount: string,
    coinSymbol: CoinSymbol = chain,
    tokenSymbol: CurrencySymbol | undefined = token
  ) => {
    const isL2 = L2Regex.exec(validatedAddressPair?.convertedToAddress);
    const nitr0genApi = new Nitr0genApi();

    try {
      if (!cacheOtk || !activeAccount || !account) {
        return 'GenericFailureMsg';
      }

      if (isL2) {
        const l2TransactionData: L2TxDetail = {
          initiatedToNonL2: !L2Regex.exec(
            validatedAddressPair.userInputToAddress
          )
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
          throw new Error(keyError.noSelfSend);

        const txBody = await nitr0genApi.L2Transaction(
          cacheOtk,
          // AC needs smallest units, so we convert
          convertObjectCurrencies(l2TransactionData, convertToDecimals)
        );

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
        };
      }

      const transactionData: IWithdrawalProposal = {
        identity: activeAccount.identity,
        toAddress: validatedAddressPair.convertedToAddress,
        // Backend accepts "normal" units, so we don't convert
        amount,
        coinSymbol,
        tokenSymbol,
      };

      const {
        fees: { feesEstimate, delegatedFee },
        withdrawalKey,
        ethGasPrice,
      } = await OwnersAPI.prepareL1Txn(transactionData);
      const withdrawal: ITransactionForSigning = {
        identity: activeAccount.identity,
        fromAddress: withdrawalKey.address,
        fromLedgerId: withdrawalKey.ledgerId,
        toAddress: validatedAddressPair.convertedToAddress,
        amount,
        coinSymbol,
        tokenSymbol,
        feesEstimate,
        layer: TransactionLayer.L1,
        txToSign: await nitr0genApi.L2ToL1SignTransaction(
          cacheOtk,
          withdrawalKey.ledgerId,
          coinSymbol,
          // AC needs smallest units, so we convert
          convertToDecimals(amount, coinSymbol, tokenSymbol),
          validatedAddressPair.convertedToAddress,
          convertToDecimals(feesEstimate, coinSymbol),
          tokenSymbol,
          ethGasPrice
        ),
      };

      // sign txns and move to final confirmation
      // Okay to assert since we have filtered out on the line before
      const signedTxn = await signTxBody(withdrawal.txToSign, cacheOtk);

      return { txn: withdrawal, signedTxn, delegatedFee };
    } catch (error) {
      datadogRum.addError(error);
      return unpackRequestErrorMessage(error);
    }
  };
};
