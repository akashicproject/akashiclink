/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import './theme/font.css';
import './theme/common.scss';

import { Browser } from '@capacitor/browser';
import { datadogRum } from '@datadog/browser-rum';
import { IonAlert, IonApp, setupIonicReact } from '@ionic/react';
import { IonReactMemoryRouter } from '@ionic/react-router';
import { compareVersions } from 'compare-versions';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PreferenceProvider } from './components/PreferenceProvider';
import { history } from './history';
import { NavigationTree } from './routing/navigation-tree';
import { useConfig } from './utils/hooks/useConfig';
import { useLocalStorage } from './utils/hooks/useLocalStorage';

setupIonicReact();

// eslint-disable-next-line import/no-default-export
export default function App() {
  const { t } = useTranslation();
  const { config } = useConfig();
  const [skipVersion, setSkipVersion] = useLocalStorage('skipVersion', '0.0.0');
  const [updateType, setUpdateType] = useState<'soft' | 'hard' | null>(null);

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
    <IonApp>
      <PreferenceProvider>
        <IonReactMemoryRouter history={history}>
          <NavigationTree />
        </IonReactMemoryRouter>
      </PreferenceProvider>
      <IonAlert
        isOpen={updateType === 'soft' || updateType === 'hard'}
        onDidDismiss={() => updateType === 'soft' && setUpdateType(null)}
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
    </IonApp>
  );
}
