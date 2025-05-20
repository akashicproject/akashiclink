import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import { WhiteButton } from '../../components/common/buttons';
import { LayoutWithActivityTab } from '../../components/page-layout/layout-with-activity-tab';
import { SelectCoin } from '../../components/send-deposit/select-coin';
import { SendFormTriggerButton } from '../../components/send-deposit/send-form-trigger-button';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <LayoutWithActivityTab>
      <IonGrid
        style={{
          width: '100%',
          height: '40vh',
          margin: 0,
          padding: '8px 48px',
        }}
      >
        <SelectCoin />
        <IonRow className={'ion-grid-row-gap-xs'}>
          <IonCol size={'6'}>
            <SendFormTriggerButton />
          </IonCol>
          <IonCol size={'6'}>
            <WhiteButton
              expand="block"
              routerLink={akashicPayPath(urls.deposit)}
            >
              {t('Deposit')}
              <IonIcon slot="end" icon={arrowDownOutline} />
            </WhiteButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </LayoutWithActivityTab>
  );
}
