import { IonCol, IonRow } from '@ionic/react';

import { WhiteButton } from '../../components/buttons';
import { LoggedMain } from './logged-main';

export function LoggedCreate() {
  return (
    <LoggedMain>
      <IonRow style={{ height: '350px' }} class="ion-align-items-center">
        <IonCol>
          <WhiteButton expand="block">Create BTC Wallet</WhiteButton>
        </IonCol>
      </IonRow>
    </LoggedMain>
  );
}
