import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonPage,
  IonRouterLink,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { BackButton } from '../components/back-button';

export function SettingsInfo() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Info</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="center">
        <IonItem>
          <IonRouterLink href="us2.money.com">US² Chain</IonRouterLink>
        </IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <BackButton />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
