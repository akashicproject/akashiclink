import {
  IonButton,
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
import { useHistory } from 'react-router-dom';

export function SettingsInfo() {
  const history = useHistory();

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
              <IonButton onClick={() => history.goBack()}>Back</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
