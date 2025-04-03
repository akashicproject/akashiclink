import { datadogRum } from '@datadog/browser-rum';
import { L2Regex } from '@helium-pay/backend';

import type { ValidatedAddressPair } from '../../components/send-deposit/send-form/types';
import { useAppSelector } from '../../redux/app/hooks';
import { selectCacheOtk } from '../../redux/slices/accountSlice';
import { selectFocusCurrencyDetail } from '../../redux/slices/preferenceSlice';
import { OwnersAPI } from '../api';
import { signTxBody } from '../nitr0gen-api';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';

export const useVerifyTxnAndSign = () => {
  const { chain, token } = useAppSelector(selectFocusCurrencyDetail);
  const cacheOtk = useAppSelector(selectCacheOtk);

  return async (validatedAddressPair: ValidatedAddressPair, amount: string) => {
    const isL2 = L2Regex.exec(validatedAddressPair?.convertedToAddress);

    try {
      if (!cacheOtk) {
        return 'GenericFailureMsg';
      }
      const txns = await OwnersAPI.verifyTransactionUsingClientSideOtk({
        toAddress: validatedAddressPair.convertedToAddress,
        amount,
        coinSymbol: chain,
        tokenSymbol: token,
        forceL1: !isL2,
      });

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
