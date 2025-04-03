import { Browser } from '@capacitor/browser';
import { IonAlert } from '@ionic/react';
import { compareVersions } from 'compare-versions';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../utils/hooks/useConfig';
import { useCurrentAppInfo } from '../../utils/hooks/useCurrentAppInfo';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';

// eslint-disable-next-line import/no-default-export
export default function VersionUpdateAlert() {
  const { t } = useTranslation();
  const { config } = useConfig();

  const [, setAvailableVersion] = useLocalStorage(
    'available-app-version',
    '0.0.0'
  );
  const [, setUpdateUrl] = useLocalStorage('update_url', '');
  const [skipVersion, setSkipVersion] = useLocalStorage('skipVersion', '0.0.0');
  const [updateType, setUpdateType] = useLocalStorage('update-type', '');

  const info = useCurrentAppInfo();

  useEffect(() => {
    const appVersion = info?.version?.split('-')[0];

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
  }, [config, skipVersion, info]);

  return (
    <IonAlert
      isOpen={updateType === 'soft' || updateType === 'hard'}
      onDidDismiss={() => updateType === 'soft' && setUpdateType('')}
      backdropDismiss={false}
      header={t('NewVersionAvailable')}
      message={t('NewVersionAvailableMessage')}
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
