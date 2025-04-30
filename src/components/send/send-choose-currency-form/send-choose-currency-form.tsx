import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useContext } from 'react';

import {
  type IWalletCurrency,
  SUPPORTED_CURRENCIES_FOR_EXTENSION,
} from '../../../constants/currencies';
import { CryptoCurrencyList } from '../../crypto-currency/crypto-currency-list';
import { SendFormContext } from '../send-modal-context-provider';

export const SendChooseCurrencyForm = () => {
  const { setStep, step, setCurrency } = useContext(SendFormContext);

  const handleChooseCurrency = (walletCurrency: IWalletCurrency) => {
    setCurrency(walletCurrency);
    setStep(step + 1);
  };

  return (
    <IonGrid
      className={
        'ion-padding-top-md ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
      }
    >
      <IonRow>
        <IonCol size={'12'}>
          <CryptoCurrencyList
            minHeight={'80vh'}
            currencies={SUPPORTED_CURRENCIES_FOR_EXTENSION.list.map(
              (c) => c.walletCurrency
            )}
            showUSDValue
            onClick={(walletCurrency) => handleChooseCurrency(walletCurrency)}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
