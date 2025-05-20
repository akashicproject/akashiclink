import { IonCheckbox, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import {
  type IWalletCurrency,
  SUPPORTED_CURRENCIES_FOR_EXTENSION,
} from '../../constants/currencies';
import { CryptoCurrencyIcon } from '../common/chain-icon/crypto-currency-icon';
import { DashboardPreferenceContext } from './dashboard-preference-modal-trigger-button';

export const DashboardPreferenceCurrencyFilter = () => {
  const { t } = useTranslation();
  const { hiddenCurrencies, setHiddenCurrencies } = useContext(
    DashboardPreferenceContext
  );

  const handleOnClickCurrency = (currency: IWalletCurrency) => {
    const key = `${currency.chain}-${currency.token ?? ''}`;

    if (hiddenCurrencies.includes(key)) {
      setHiddenCurrencies(
        hiddenCurrencies.filter((hiddenCurrency) => hiddenCurrency !== key)
      );
    } else {
      setHiddenCurrencies([...hiddenCurrencies, key]);
    }
  };

  return (
    <IonGrid
      className={
        'ion-padding-top-0 ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
      }
    >
      <IonRow className={'ion-center ion-grid-row-gap-sm'}>
        <IonCol className={'ion-text-align-center'} size={'12'}>
          <IonText>
            <h2 className="ion-margin-bottom-xxs ion-text-align-left">
              {t('Preferences')}
            </h2>
            <p>{t('PreferencesDesc')}</p>
          </IonText>
          <Virtuoso
            style={{
              minHeight: 'calc(60vh - 110px - var(--ion-safe-area-bottom)',
            }}
            data={SUPPORTED_CURRENCIES_FOR_EXTENSION.list}
            itemContent={(_, { walletCurrency }) => (
              <IonCheckbox
                key={walletCurrency.displayName}
                labelPlacement="end"
                justify="start"
                checked={
                  !hiddenCurrencies.includes(
                    `${walletCurrency.chain}-${walletCurrency.token ?? ''}`
                  )
                }
                value={`${walletCurrency.chain}-${walletCurrency.token ?? ''}`}
                onClick={(_) => handleOnClickCurrency(walletCurrency)}
                className="w-100 ion-padding-top-xxs ion-padding-bottom-xxs ion-margin-top-xs ion-margin-bottom-xs"
              >
                <div
                  className={
                    'ion-display-flex ion-align-items-center ion-gap-sm'
                  }
                >
                  <CryptoCurrencyIcon currency={walletCurrency} size={24} />
                  <h5 className="ion-no-margin">
                    {walletCurrency.displayName}
                  </h5>
                </div>
              </IonCheckbox>
            )}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
