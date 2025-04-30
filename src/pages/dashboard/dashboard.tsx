import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { DashboardCryptoCurrencyList } from '../../components/dashboard/dashboard-crypto-currency-list';
import { TotalBalance } from '../../components/dashboard/total-balance';
import { DepositModalTriggerButton } from '../../components/deposit/deposit-modal-trigger-button';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { SendFormTriggerButton } from '../../components/send/send-form-trigger-button';

export function Dashboard() {
  return (
    <DashboardLayout>
      <IonGrid className={'ion-padding-top-md ion-padding-bottom-0'}>
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
        <IonRow>
          <IonCol size={'12'}>
            <DashboardCryptoCurrencyList />
          </IonCol>
        </IonRow>
      </IonGrid>
    </DashboardLayout>
  );
}
