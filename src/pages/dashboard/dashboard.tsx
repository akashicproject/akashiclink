import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { DepositModalTriggerButton } from '../../components/deposit/deposit-modal-trigger-button';
import { LayoutWithActivityTab } from '../../components/page-layout/layout-with-activity-tab';
import { SelectCoin } from '../../components/send/select-coin';
import { SendFormTriggerButton } from '../../components/send/send-form-trigger-button';

export function Dashboard() {
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
            <DepositModalTriggerButton />
          </IonCol>
        </IonRow>
      </IonGrid>
    </LayoutWithActivityTab>
  );
}
