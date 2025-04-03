import './logged.css';

import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { SelectCoin } from '../../components/select-coin';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';
import { lastPageStorage } from '../../utils/last-page-storage';
import { WALLET_CURRENCIES } from '../../utils/supported-currencies';
import { LoggedMain } from './logged-main';

export function LoggedFunction() {
  const { t } = useTranslation();
  const [coinSymbol, setCoinSymbol] = useState(WALLET_CURRENCIES[0].symbol);

  // store current page to main logged page if reopen
  useEffect(() => {
    lastPageStorage.store(urls.loggedFunction);
  }, []);

  return (
    <LoggedMain>
      <SelectCoin changeCurrency={(code) => setCoinSymbol(code)} />
      <IonGrid>
        <IonRow class="ion-justify-content-between">
          <IonCol>
            <PurpleButton
              expand="block"
              routerLink={heliumPayPath(urls.sendTo, {
                coinSymbol: coinSymbol,
              })}
            >
              {t('Send')}
              <IonIcon slot="end" icon={arrowForwardOutline}></IonIcon>
            </PurpleButton>
          </IonCol>
          <IonCol>
            <WhiteButton
              expand="block"
              routerLink={heliumPayPath(urls.loggedDeposit, {
                coinSymbol: coinSymbol,
              })}
            >
              {t('Deposit')}
              <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
            </WhiteButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </LoggedMain>
  );
}
