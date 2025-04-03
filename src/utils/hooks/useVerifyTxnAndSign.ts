import { datadogRum } from '@datadog/browser-rum';
import {
  type ITransactionVerifyResponse,
  L2Regex,
  TransactionLayer,
} from '@helium-pay/backend';

import type { ValidatedAddressPair } from '../../components/send-deposit/send-form/types';
import { useAppSelector } from '../../redux/app/hooks';
import { selectCacheOtk } from '../../redux/slices/accountSlice';
import { selectFocusCurrencyDetail } from '../../redux/slices/preferenceSlice';
import { OwnersAPI } from '../api';
import type { L2TxDetail } from '../nitr0gen/nitr0gen.interface';
import { Nitr0genApi, signTxBody } from '../nitr0gen/nitr0gen-api';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';
import { useAccountStorage } from './useLocalAccounts';

export const useVerifyTxnAndSign = () => {
  const { chain, token } = useAppSelector(selectFocusCurrencyDetail);
  const cacheOtk = useAppSelector(selectCacheOtk);
  const { activeAccount } = useAccountStorage();

  return async (validatedAddressPair: ValidatedAddressPair, amount: string) => {
    const isL2 = L2Regex.exec(validatedAddressPair?.convertedToAddress);
    const nitr0genApi = new Nitr0genApi();

    try {
      if (!cacheOtk || !activeAccount) {
        return 'GenericFailureMsg';
      }

      let txns: ITransactionVerifyResponse[];
      try {
        txns = await OwnersAPI.verifyTransactionUsingClientSideOtk({
          toAddress: validatedAddressPair.convertedToAddress,
          amount,
          coinSymbol: chain,
          tokenSymbol: token,
        });
      } catch (error) {
        datadogRum.addError(error);

        // fallback to build transaction locally
        if (isL2) {
          const l2TxDetail: L2TxDetail = {
            toAddress: validatedAddressPair.convertedToAddress,
            amount,
            coinSymbol: chain,
            tokenSymbol: token,
          };
          const txBody = await nitr0genApi.L2Transaction(cacheOtk, l2TxDetail);
          txns = [
            {
              ...l2TxDetail,
              layer: TransactionLayer.L2,
              fromAddress: activeAccount.identity,
              txToSign: txBody,
            },
          ];
        } else {
          // TODO: build L1 transaction locally
          return 'GenericFailureMsg';
        }
      }

      // reject the request if /verify returns multiple transfers
      // for L2: multiple transactions from the same Nitr0gen identity can always be combined into a single one
      if ((!isL2 && txns.length > 1) || txns.length === 0) {
        return 'GenericFailureMsg';
      }

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
