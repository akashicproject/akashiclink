import { datadogRum } from '@datadog/browser-rum';
import type { CoinSymbol, CurrencySymbol } from '@helium-pay/backend';
import {
  type ITransactionProposal,
  type ITransactionVerifyResponse,
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
        const l2TransactionData: ITransactionProposal = {
          initiatedToNonL2: !L2Regex.exec(
            validatedAddressPair.userInputToAddress
          )
            ? validatedAddressPair.userInputToAddress
            : undefined,
          toAddress: validatedAddressPair.convertedToAddress,
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

        const txns: ITransactionVerifyResponse[] = [
          {
            ...l2TransactionData,
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
          },
        ];

        return {
          txns,
          signedTxns: [txBody],
        };
      }

      const transactionData: ITransactionProposal = {
        identity: activeAccount.identity,
        toAddress: validatedAddressPair.convertedToAddress,
        // Backend accepts "normal" units, so we don't convert
        amount,
        coinSymbol,
        tokenSymbol,
      };

      const {
        fees: { feesEstimate },
        withdrawalKeys,
      } = await OwnersAPI.prepareL1Txn(transactionData);
      const txns: ITransactionVerifyResponse[] = await Promise.all(
        withdrawalKeys.map(
          async (key) =>
            ({
              ownedIdentity: activeAccount.identity,
              fromAddress: key.address,
              fromLedgerId: key.ledgerId,
              toAddress: validatedAddressPair.convertedToAddress,
              amount: key.transferAmount,
              coinSymbol,
              tokenSymbol,
              feesEstimate,
              layer: TransactionLayer.L1,
              txToSign: await nitr0genApi.L2ToL1SignTransaction(
                cacheOtk,
                key.ledgerId,
                coinSymbol,
                // AC needs smallest units, so we convert
                convertToDecimals(key.transferAmount, coinSymbol, tokenSymbol),
                validatedAddressPair.convertedToAddress,
                convertToDecimals(feesEstimate, coinSymbol, tokenSymbol),
                tokenSymbol
              ),
            } as ITransactionVerifyResponse)
        )
      );

      // reject the request if /verify returns multiple transfers
      if (txns.length !== 1) return 'GenericFailureMsg';

      // sign txns and move to final confirmation
      // Okay to assert since we have filtered out on the line before
      const signedTxns = await Promise.all(
        txns
          .filter((res) => !!res.txToSign)
          .map((res) => signTxBody(res.txToSign!, cacheOtk))
      );

      return { txns, signedTxns };
    } catch (error) {
      datadogRum.addError(error);
      return unpackRequestErrorMessage(error);
    }
  };
};
