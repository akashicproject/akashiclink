import './logged.css';

import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { SelectCoin } from '../../components/select-coin';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { LoggedLayoutWithActivityTab } from './logged-layout-with-activity-tab';

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <LoggedLayoutWithActivityTab showBackButton={false}>
      <IonGrid
        style={{
          width: '100%',
          height: '40vh',
          margin: '0px',
          padding: '32px 48px',
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
    </LoggedLayoutWithActivityTab>
  );
}
