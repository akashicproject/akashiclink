import { datadogRum } from '@datadog/browser-rum';
import { L2Regex } from '@helium-pay/backend';
import Big from 'big.js';

import {
  useCacheOtk,
  useFocusCurrencyDetail,
} from '../../components/providers/PreferenceProvider';
import type { ValidatedAddressPair } from '../../components/send-deposit/send-form/types';
import { OwnersAPI } from '../api';
import { signTxBody } from '../nitr0gen-api';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';
import { useFocusCurrencySymbolsAndBalances } from './useAggregatedBalances';
import { useAccountStorage } from './useLocalAccounts';

export const useVerifyTxnAndSign = () => {
  const { chain, token } = useFocusCurrencyDetail();
  const [cacheOtk, _] = useCacheOtk();
  const { activeAccount } = useAccountStorage();
  const { currencyBalance } = useFocusCurrencySymbolsAndBalances();

  return async (validatedAddressPair: ValidatedAddressPair, amount: string) => {
    const isL2 = L2Regex.exec(validatedAddressPair?.convertedToAddress);
    const availableBalance = currencyBalance ?? '0';

    if (!cacheOtk) {
      return 'GenericFailureMsg';
    }

    try {
      const txns = await OwnersAPI.verifyTransactionUsingClientSideOtk({
        fromAddress: activeAccount?.identity,
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

      // final check if balance is enough
      if (
        Big(amount).gt(
          Big(availableBalance ?? 0).sub(txns[0].feesEstimate ?? '0')
        )
      ) {
        return isL2 ? 'SavingsExceeded' : 'insufficientBalance';
      }

      // sign txns and move to final confirmation
      const signedTxns = await Promise.all(
        txns
          .filter((res) => typeof res.txToSign !== 'undefined')
          .map((res) => signTxBody(res.txToSign!, cacheOtk))
      );

      return { txns, signedTxns };
    } catch (error) {
      datadogRum.addError(error);
      return unpackRequestErrorMessage(error);
    }
  };
};
