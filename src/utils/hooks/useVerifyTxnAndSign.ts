import { datadogRum } from '@datadog/browser-rum';
import { L2Regex } from '@helium-pay/backend';

import {
  useCacheOtk,
  useFocusCurrencyDetail,
} from '../../components/providers/PreferenceProvider';
import type { ValidatedAddressPair } from '../../components/send-deposit/send-form/types';
import { OwnersAPI } from '../api';
import { signTxBody } from '../nitr0gen-api';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';
import { useAccountStorage } from './useLocalAccounts';

export const useVerifyTxnAndSign = () => {
  const { chain, token } = useFocusCurrencyDetail();
  const [cacheOtk, _] = useCacheOtk();
  const { activeAccount } = useAccountStorage();

  return async (validatedAddressPair: ValidatedAddressPair, amount: string) => {
    const isL2 = L2Regex.exec(validatedAddressPair?.convertedToAddress);

    try {
      if (!cacheOtk) {
        return 'GenericFailureMsg';
      }
      const txns = await OwnersAPI.verifyTransactionUsingClientSideOtk({
        fromAddress: activeAccount?.identity,
        toAddress: validatedAddressPair.convertedToAddress,
        amount,
        coinSymbol: chain,
        tokenSymbol: token,
        forceL1: !isL2,
        toL1Address:
          isL2 && validatedAddressPair.userInputToAddressType === 'l1'
            ? validatedAddressPair.userInputToAddress
            : undefined,
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
