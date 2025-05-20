import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { DashboardCryptoCurrencyList } from '../../components/dashboard/dashboard-crypto-currency-list';
import { TotalBalance } from '../../components/dashboard/total-balance';
import { DepositModalTriggerButton } from '../../components/deposit/deposit-modal-trigger-button';
import { LayoutWithActivityTab } from '../../components/page-layout/layout-with-activity-tab';
import { SendFormTriggerButton } from '../../components/send/send-form-trigger-button';

export function Dashboard() {
  return (
    <LayoutWithActivityTab>
      <IonGrid>
        <IonRow className={'ion-grid-row-gap-xs'}>
          <IonCol size={'12'}>
            <TotalBalance />
          </IonCol>
          <IonCol size={'5'} offset={'1'}>
            <SendFormTriggerButton />
          </IonCol>
          <IonCol size={'5'}>
            <DepositModalTriggerButton />
          </IonCol>
        </IonRow>
        <IonRow style={{ height: '31vh' }}>
          <IonCol size={'12'}>
            {/* the 32vh will be updated in #1429 */}
            <DashboardCryptoCurrencyList />
          </IonCol>
        </IonRow>
      </IonGrid>
    </LayoutWithActivityTab>
  );
}
