import { debounce } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';

import type { ValidatedAddressPair } from '../../components/send/send-form/types';
import { SendFormContext } from '../../components/send/send-modal-context-provider';
import { OwnersAPI } from '../api';
import { useCryptoCurrencySymbolsAndBalances } from './useCryptoCurrencySymbolsAndBalances';

export const useEstimatedNetworkFee = ({
  validatedAddressPair,
  amount,
  identity,
}: {
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
  identity?: string;
}) => {
  const [networkFee, setNetworkFee] = useState<string | null>(null);
  const [
    isFirstTimeInteractionWithAddress,
    setIsFirstTimeInteractionWithAddress,
  ] = useState<boolean | undefined>(undefined);
  const { currency } = useContext(SendFormContext);

  const { chain, token } = useCryptoCurrencySymbolsAndBalances(currency);

  const fetchNetworkFee = useCallback(
    debounce(async () => {
      const feeResponse = await OwnersAPI.estimateNetworkFees({
        toAddress: validatedAddressPair.convertedToAddress,
        amount,
        coinSymbol: chain,
        ...(token ? { tokenSymbol: token } : {}),
        ...(identity ? { identity } : {}),
      });

      setNetworkFee(feeResponse.networkFee);
      setIsFirstTimeInteractionWithAddress(
        feeResponse.isFirstTimeInteractionWithAddress
      );
    }, 500),
    [validatedAddressPair, amount, chain, identity]
  );

  useEffect(() => {
    if (!validatedAddressPair.isL2) {
      fetchNetworkFee();
    }
    return () => {
      fetchNetworkFee.cancel(); // Cleanup function to cancel pending calls
    };
  }, [fetchNetworkFee]);

  return { networkFee, isFirstTimeInteractionWithAddress };
};
