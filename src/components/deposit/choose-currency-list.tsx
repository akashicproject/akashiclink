import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ALLOWED_NETWORKS } from '../../constants/currencies';
import type { DepositChainOption } from '../../utils/hooks/useAccountL1Address';
import { useFetchAndRemapL1Address } from '../../utils/hooks/useFetchAndRemapL1address';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import CryptoChainAddressItem from '../crypto-currency/crypto-chain-address-item';
import { DepositModalContext } from './deposit-modal-trigger-button';

export const ChooseCurrencyList = () => {
  const { t } = useTranslation();
  const { setStep, step, setChain } = useContext(DepositModalContext);
  const fetchAndRemapL1Address = useFetchAndRemapL1Address();

  const { activeAccount } = useAccountStorage();

  const currencies: {
    displayName: string;
    chain: DepositChainOption;
    address: string;
  }[] = [
    {
      displayName: t('Chain.AkashicChain'),
      chain: 'AkashicChain',
      address: activeAccount?.identity ?? '',
    },
    ...ALLOWED_NETWORKS.map((chain) => ({
      displayName: t(`Chain.${chain.toUpperCase()}`),
      chain,
      address:
        activeAccount?.localStoredL1Addresses?.find(
          (address) => address.coinSymbol.toLowerCase() === chain.toLowerCase()
        )?.address ?? '',
    })),
  ];

  useEffect(() => {
    fetchAndRemapL1Address();
  }, []);

  const handleChooseCurrency = (chain: DepositChainOption) => {
    setStep(step + 1);
    setChain(chain);
  };

  return (
    <IonGrid className={'ion-padding-top-0 ion-padding-bottom-xxs'}>
      <IonRow>
        <IonCol size={'12'}>
          <div
            className={
              'ion-gap-sm ion-display-flex ion-flex-wrap ion-align-items-center ion-flex-direction-column'
            }
          >
            {currencies.map(({ chain }) => (
              <CryptoChainAddressItem
                key={chain}
                chain={chain}
                onClick={(chain) => handleChooseCurrency(chain)}
              />
            ))}
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
