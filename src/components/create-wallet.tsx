import type { CoinSymbol } from '@helium-pay/backend/src/modules/api-interfaces/coin-symbol.model';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

export function CreateWallet({
  coinSymbol,
  onBack,
  onCreate,
}: {
  coinSymbol: CoinSymbol;
  onBack: () => void;
  onCreate: () => void;
}) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Wallet</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="center">
        <IonButton onClick={onBack}>Back</IonButton>
        <IonButton onClick={onCreate}>
          {`Create ${coinSymbol} Wallet`}
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
