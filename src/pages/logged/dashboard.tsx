import './logged.css';

import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { SelectCoin } from '../../components/select-coin';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import {
  cacheCurrentPage,
  NavigationPriority,
} from '../../utils/last-page-storage';
import { LoggedMain } from './logged-main';

export function Dashboard() {
  const { t } = useTranslation();

  useEffect(() => {
    cacheCurrentPage(
      urls.loggedFunction,
      NavigationPriority.AWAIT_AUTHENTICATION
    );
  }, []);

  return (
    <LoggedMain isRefresh={true}>
      <IonGrid
        style={{
          width: '100%',
          height: '40vh',
          margin: '0px',
          padding: '32px 47px',
        }}
      >
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
