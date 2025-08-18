import {
  type CoinSymbol,
  type IOwnerOldestKeysResponse,
} from '@helium-pay/backend';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type KeyedMutator } from 'swr';

import { useFetchAndRemapL1Address } from '../../utils/hooks/useFetchAndRemapL1address';
import {
  type LocalStoredL1AddressType,
  useAccountStorage,
} from '../../utils/hooks/useLocalAccounts';
import { createL1Address } from '../../utils/wallet-creation';
import { PrimaryButton } from '../common/buttons';

export const GenerateL1AddressButton = ({
  chain,
  mutate,
}: {
  chain: CoinSymbol;
  mutate: KeyedMutator<IOwnerOldestKeysResponse[]>;
}) => {
  const { t } = useTranslation();
  const { activeAccount, cacheOtk } = useAccountStorage();
  const fetchAndRemapL1Address = useFetchAndRemapL1Address();

  const [isGeneratingAddress, setIsGeneratingAddress] = useState(false);
  const existingL1Address = activeAccount?.localStoredL1Addresses?.find(
    (a: LocalStoredL1AddressType) =>
      a.coinSymbol.toLowerCase() === chain.toLowerCase() && a.address !== ''
  );

  const handleGetAddress = async () => {
    if (isGeneratingAddress) return;

    try {
      // Attempt to create missing l1 address
      if (!existingL1Address && cacheOtk && !isGeneratingAddress) {
        setIsGeneratingAddress(true);
        await createL1Address(cacheOtk, chain);
        await mutate();
        await fetchAndRemapL1Address();
      }
    } catch (e) {
      console.warn(e as Error);
    } finally {
      setIsGeneratingAddress(false);
    }
  };

  return (
    <PrimaryButton
      expand="block"
      onClick={handleGetAddress}
      isLoading={isGeneratingAddress}
    >
      {t('ClickToGenerateAddress')}
    </PrimaryButton>
  );
};
