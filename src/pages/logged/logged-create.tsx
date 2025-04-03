import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { WhiteButton } from '../../components/buttons';
import { LoggedMain } from './logged-main';

export function LoggedCreate() {
  return (
    <LoggedMain>
      <IonGrid fixed>
        <IonRow class="ion-justify-content-center ion-margin-top">
          <IonCol size="6">
            <WhiteButton expand="block">Create BTC Wallet</WhiteButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </LoggedMain>
  );
}
