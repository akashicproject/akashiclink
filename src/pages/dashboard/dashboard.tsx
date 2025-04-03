import '../../components/page-layout/layout-with-activity-tab.scss';

import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/common/buttons';
import { LayoutWithActivityTab } from '../../components/page-layout/layout-with-activity-tab';
import { SelectCoin } from '../../components/send-deposit/select-coin';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <LayoutWithActivityTab showBackButton={false}>
      <IonGrid
        style={{
          width: '100%',
          height: '40vh',
          margin: '0px',
          padding: '24px 48px',
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
              routerLink={akashicPayPath(urls.deposit)}
            >
              {t('Deposit')}
              <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
            </WhiteButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </LayoutWithActivityTab>
  );
}
