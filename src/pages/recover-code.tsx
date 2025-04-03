import './common.css';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';

export function RecoverCode() {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recover</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="center">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Verification code sent</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonItem>
              <IonLabel>Code</IonLabel>
              <IonInput placeholder="Enter code"></IonInput>
            </IonItem>
          </IonCardContent>
          <IonButton
            onClick={() => history.push(heliumPayPath(urls.recoverCode))}
          >
            Send
          </IonButton>
        </IonCard>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton onClick={() => history.goBack()}>Back</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink={heliumPayPath(urls.dashboard)}>
                Confirm
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
