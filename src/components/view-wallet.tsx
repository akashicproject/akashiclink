import '../pages/common.css';

import { NetworkDictionary } from '@helium-pay/backend/src/modules/api-interfaces/networks/networks.model';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
} from '@ionic/react';

import type { Wallet } from '../constants/dummy-data';

export function ViewWallet({
  wallet,
  onBack,
}: {
  wallet: Wallet;
  onBack: () => void;
}) {
  return (
    <IonPage>
      <IonContent class="center">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {NetworkDictionary[wallet.coinSymbol].displayName}
            </IonCardTitle>
          </IonCardHeader>
          <img alt="dummy QE" src="/shared-assets/images/no-data.svg" />
          <IonItem>
            <IonLabel>Public Address</IonLabel>
            {wallet.address}
          </IonItem>
          <IonButton onClick={onBack}>Back</IonButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
