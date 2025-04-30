import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useContext } from 'react';

import {
  type IWalletCurrency,
  SUPPORTED_CURRENCIES_FOR_EXTENSION,
} from '../../../constants/currencies';
import { useAppDispatch } from '../../../redux/app/hooks';
import { setFocusCurrency } from '../../../redux/slices/preferenceSlice';
import { CryptoCurrencyList } from '../../crypto-currency/crypto-currency-list';
import { SendFormContext } from '../send-form-trigger-button';

export const SendChooseCurrencyForm = () => {
  const dispatch = useAppDispatch();
  const { setStep, step } = useContext(SendFormContext);

  const handleChooseCurrency = (walletCurrency: IWalletCurrency) => {
    dispatch(setFocusCurrency(walletCurrency));
    setStep(step + 1);
  };

  return (
    <IonGrid
      className={
        'ion-padding-top-0 ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
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
