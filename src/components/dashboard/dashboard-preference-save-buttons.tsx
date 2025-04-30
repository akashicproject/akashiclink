import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import {
  CURRENCIES_SORT_MODE,
  HIDDEN_CURRENCIES,
  HIDE_SMALL_BALANCES,
} from '../../utils/preference-keys';
import { PrimaryButton, WhiteButton } from '../common/buttons';
import {
  type DashboardListSortingMode,
  DashboardPreferenceContext,
} from './dashboard-preference-modal-trigger-button';

export function DashboardPreferenceSaveButtons() {
  const { t } = useTranslation();

  const { setValue: setLocalStorageHideSmallBalance } =
    useLocalStorage<boolean>(HIDE_SMALL_BALANCES);

  const { setValue: setLocalStorageHiddenCurrencies } =
    useLocalStorage<string[]>(HIDDEN_CURRENCIES);

  const { setValue: setLocalStorageCurrenciesSortMode } =
    useLocalStorage<DashboardListSortingMode>(CURRENCIES_SORT_MODE);

  const {
    hiddenCurrencies,
    currenciesSortMode,
    setIsModalOpen,
    setStep,
    hideSmallBalance,
  } = useContext(DashboardPreferenceContext);

  const onConfirm = async () => {
    await setLocalStorageHideSmallBalance(hideSmallBalance);
    await setLocalStorageHiddenCurrencies(hiddenCurrencies);
    await setLocalStorageCurrenciesSortMode(currenciesSortMode);

    setStep(0);
    setIsModalOpen(false);
  };

  const onCancel = () => {
    setStep(0);
    setIsModalOpen(false);
  };

  return (
    <IonGrid
      className={
        'ion-padding-top-0 ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
      }
    >
      <IonRow>
        <IonCol size={'6'}>
          <PrimaryButton onClick={onConfirm} expand="block">
            {t('Confirm')}
          </PrimaryButton>
        </IonCol>
        <IonCol size={'6'}>
          <WhiteButton onClick={onCancel} expand="block">
            {t('Cancel')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
