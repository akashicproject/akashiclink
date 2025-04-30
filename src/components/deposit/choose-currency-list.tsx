import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useContext, useEffect } from 'react';

import { useAccountL1Address } from '../../utils/hooks/useAccountAllAddresses';
import type { DepositChainOption } from '../../utils/hooks/useAccountL1Address';
import { useFetchAndRemapL1Address } from '../../utils/hooks/useFetchAndRemapL1address';
import CryptoChainAddressItem from '../crypto-currency/crypto-chain-address-item';
import { DepositModalContext } from './deposit-modal-context-provider';

export const ChooseCurrencyList = () => {
  const { setStep, step, setChain } = useContext(DepositModalContext);
  const fetchAndRemapL1Address = useFetchAndRemapL1Address();
  const allAddresses = useAccountL1Address();

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
            {allAddresses.map(({ chain }) => (
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
