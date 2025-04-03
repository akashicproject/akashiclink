import { Browser } from '@capacitor/browser';
import { datadogRum } from '@datadog/browser-rum';
import { IonAlert } from '@ionic/react';
import { compareVersions } from 'compare-versions';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../utils/hooks/useConfig';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';

// eslint-disable-next-line import/no-default-export
export default function VersionUpdateAlert() {
  const { t } = useTranslation();
  const { config } = useConfig();

  const [, setCurrentAppVersion] = useLocalStorage(
    'current-app-version',
    '0.0.0'
  );
  const [, setAvailableVersion] = useLocalStorage(
    'available-app-version',
    '0.0.0'
  );
  const [, setUpdateUrl] = useLocalStorage('update_url', '');
  const [skipVersion, setSkipVersion] = useLocalStorage('skipVersion', '0.0.0');
  const [updateType, setUpdateType] = useLocalStorage('update-type', '');

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (config.awLatestVersion && skipVersion) {
      const xhr = new XMLHttpRequest();
      xhr.overrideMimeType('application/json');
      xhr.open('GET', 'manifest.json', true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            const manifestData = JSON.parse(xhr.responseText);
            const appVersion = manifestData.version.split('-')[0];
            setCurrentAppVersion(appVersion);
            setAvailableVersion(config.awLatestVersion);
            setUpdateUrl(config.awUrl);
            if (compareVersions(appVersion, config.awMinVersion) === -1) {
              setUpdateType('hard');
            } else if (
              // check if skip before
              skipVersion !== config.awLatestVersion &&
              compareVersions(appVersion, config.awLatestVersion) === -1
            ) {
              setUpdateType('soft');
            }
          } catch (error) {
            datadogRum.addError(error);
          }
        }
      };
      xhr.send(null);
    }
  }, [config, skipVersion]);

  return (
    <IonAlert
      isOpen={updateType === 'soft' || updateType === 'hard'}
      onDidDismiss={() => updateType === 'soft' && setUpdateType('')}
      backdropDismiss={false}
      header={t('NewVersionAvailable')!}
      message={t('NewVersionAvailableMessage')!}
      buttons={[
        ...(updateType === 'soft'
          ? [
              {
                text: t('Later'),
                role: 'cancel',
                handler: () => {
                  setSkipVersion(config.awLatestVersion);
                },
              },
            ]
          : []),
        {
          text: t('Update'),
          role: 'confirm',
          handler: async () => {
            setSkipVersion(config.awLatestVersion);
            await Browser.open({
              url: config.awUrl,
            });
            // make it non dismissable
            return false;
          },
        },
      ]}
    />
  );
}
