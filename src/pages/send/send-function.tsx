import { IonCol, IonIcon, IonRow } from '@ionic/react';
import { arrowDownOutline, arrowForwardOutline } from 'ionicons/icons';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { SelectCoin } from '../../components/select-coin';
import { SendMain } from './send-main';

export function SendFunction() {
  return (
    <SendMain>
      <SelectCoin />
      <IonRow class="ion-justify-content-between" style={{ marginTop: '24px' }}>
        <IonCol>
          <PurpleButton expand="block">
            Send
            <IonIcon slot="end" icon={arrowForwardOutline}></IonIcon>
          </PurpleButton>
        </IonCol>
        <IonCol>
          <WhiteButton expand="block">
            Deposit
            <IonIcon slot="end" icon={arrowDownOutline}></IonIcon>
          </WhiteButton>
        </IonCol>
      </IonRow>
      <IonRow style={{ marginTop: '100px' }}>
        <IonCol>
          <WhiteButton expand="block">Go Back</WhiteButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
