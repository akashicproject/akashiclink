import './common.css';

import { LANGUAGE_LIST } from '@helium-pay/common-i18n/src/locales/supported-languages';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export function SettingsLanguage() {
  const history = useHistory();
  const { i18n } = useTranslation();
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings Language</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="center">
        <IonList>
          <IonRadioGroup
            value={LANGUAGE_LIST[0].locale}
            onIonChange={({ detail: { value } }) => changeLanguage(value)}
          >
            {LANGUAGE_LIST.map((l) => (
              <IonItem key={String(l)}>
                <IonLabel>{l.title}</IonLabel>
                <IonRadio slot="end" value={l.locale}></IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>
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
