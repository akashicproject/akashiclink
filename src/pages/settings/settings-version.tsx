import { datadogRum } from '@datadog/browser-rum';
import { IonCol, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoggedLayout } from '../../components/layout/logged-layout';
import { MainGrid } from '../../components/layout/main-grid';

export function SettingsVersion() {
  const { t } = useTranslation();

  const [version, setVersion] = useState<string>();
  const [releaseDate, setReleaseDate] = useState<string>();

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', 'manifest.json', true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          const manifestData = JSON.parse(xhr.responseText);
          setVersion(manifestData.version);
          setReleaseDate(manifestData.releaseDate);
        } catch (error) {
          datadogRum.addError(error);
        }
      }
    };
    xhr.send(null);
  }, []);

  return (
    <LoggedLayout>
      <MainGrid style={{ padding: '32px 32px' }}>
        <IonRow>
          <IonCol>
            <h2>{t('VersionInfo')}</h2>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <b>{version}</b>
          </IonCol>
          <IonCol class="ion-center">{releaseDate}</IonCol>
        </IonRow>
      </MainGrid>
    </LoggedLayout>
  );
}
