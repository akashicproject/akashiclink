import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { TotalBalance } from '../../components/dashboard/total-balance';
import { DepositModalTriggerButton } from '../../components/deposit/deposit-modal-trigger-button';
import { LayoutWithActivityTab } from '../../components/page-layout/layout-with-activity-tab';
import { SendFormTriggerButton } from '../../components/send/send-form-trigger-button';

export function Dashboard() {
  return (
    <LayoutWithActivityTab>
      <IonGrid
        style={{
          width: '100%',
          height: '40vh',
          margin: 0,
          padding: '0 16px',
        }}
      >
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
      </IonGrid>
    </LayoutWithActivityTab>
  );
}
