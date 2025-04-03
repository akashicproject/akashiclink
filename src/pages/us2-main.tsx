import './us2-main.css';

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { ExploreContainer } from '../components/explore-container';

export function Us2Main() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Example toolbar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">US²</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Main" />
      </IonContent>
    </IonPage>
  );
}
