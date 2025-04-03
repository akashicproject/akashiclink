import { IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { LoggedLayout } from '../components/layout/logged-layout';
import { MainGrid } from '../components/layout/main-grid';

export function SettingsVersion() {
  const { t } = useTranslation();

  return (
    <LoggedLayout>
      <MainGrid>
        <IonRow>
          <IonCol>
            <h2>{t('VersionInfo')}</h2>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>v0.0.1</IonCol>
          <IonCol>2023-01-02</IonCol>
        </IonRow>
      </MainGrid>
    </LoggedLayout>
  );
}
