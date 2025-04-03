import './logged.css';

import { IonCol, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { SelectCoin } from '../../components/select-coin';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';
import { LoggedMain } from './logged-main';

export function LoggedFunction() {
  const { t } = useTranslation();
  useEffect(() => {
    console.log(document.getElementById('activity'));
    document.getElementById('activity')?.click();
  }, []);
  const [currency, setCurrency] = useState('');

  return (
    <LoggedMain>
      <>
        <SelectCoin changeCurrency={(code) => setCurrency(code)} />
        <IonRow class="ion-justify-content-between">
          <IonCol>
            <PurpleButton
              expand="block"
              routerLink={heliumPayPath(urls.sendTo) + `/${currency}`}
            >
              {t('Send')}
              <IonIcon slot="end" icon={arrowForwardOutline}></IonIcon>
            </PurpleButton>
          </IonCol>
          <IonCol>
            <WhiteButton
              expand="block"
              routerLink={heliumPayPath(urls.loggedDeposit)}
            >
              {t('Deposit')}
              <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
            </WhiteButton>
          </IonCol>
        </IonRow>
      </>
    </LoggedMain>
  );
}
