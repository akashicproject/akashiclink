import './common.css';

import { IonCol, IonPage, IonRow } from '@ionic/react';

import { LoggedLayout } from '../components/layout/loggedLayout';
import { MainGrid } from '../components/layout/main-grid';
import { MainTitle } from '../components/layout/main-title';

export function SettingsVersion() {
  return (
    <IonPage>
      <LoggedLayout>
        <MainGrid>
          <IonRow>
            <IonCol class="ion-center">
              <MainTitle>Version Info</MainTitle>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>v0.0.1</IonCol>
            <IonCol>2023-01-02</IonCol>
          </IonRow>
        </MainGrid>
      </LoggedLayout>
    </IonPage>
  );
}
