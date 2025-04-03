import './logged.css';

import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { SelectCoin } from '../../components/select-coin';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { lastPageStorage } from '../../utils/last-page-storage';
import { LoggedMain } from './logged-main';

export function Dashboard() {
  const { t } = useTranslation();

  // store current page to main logged page if reopen
  useEffect(() => {
    lastPageStorage.store(urls.loggedFunction);
  }, []);

  return (
    <LoggedMain>
      <IonGrid style={{ width: '264px' }}>
        <SelectCoin />
        <IonRow>
          <IonCol>
            <PurpleButton
              expand="block"
              routerLink={akashicPayPath(urls.sendTo)}
            >
              {t('Send')}
              <IonIcon slot="end" icon={arrowForwardOutline}></IonIcon>
            </PurpleButton>
          </IonCol>
          <IonCol>
            <WhiteButton
              expand="block"
              routerLink={akashicPayPath(urls.loggedDeposit)}
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
