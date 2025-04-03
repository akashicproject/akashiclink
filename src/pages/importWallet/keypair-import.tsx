import { datadogRum } from '@datadog/browser-rum';
import { IMPORT_CONST } from '@helium-pay/backend';
import { IonCol, IonRow, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton } from '../../components/buttons';
import { PublicLayout } from '../../components/layout/public-layout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { historyGoBack } from '../../routing/history-stack';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { OwnersAPI } from '../../utils/api';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../../utils/last-page-storage';
import {
  restoreOtkFromKeypair,
  signImportAuth,
} from '../../utils/otk-generation';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function KeyPairImport() {
  const history = useHistory<LocationState>();
  const { t } = useTranslation();

  /**
   * Track user inputs
   */
  const [privateKey, setPrivateKey] = useState<string>();

  /**
   * Track state of page
   */

  const [alert, setAlert] = useState(formAlertResetState);

  useEffect(() => {
    cacheCurrentPage(
      urls.importAccountUrl,
      NavigationPriority.IMMEDIATE,
      async () => {
        const { otk } = await lastPageStorage.getVars();
        if (otk) {
          setPrivateKey(otk.key.prv.pkcs8pem || '');
        }
      }
    );
  });

  async function requestImport() {
    try {
      if (privateKey) {
        const otk = restoreOtkFromKeypair(privateKey);
        console.log(otk);

        const { identity, username } = await OwnersAPI.importAccount({
          publicKey: otk.key.pub.pkcs8pem,
          signedAuth: signImportAuth(privateKey, IMPORT_CONST),
          keyPairImport: true,
        });

        // If no identity: User must migrate to 12-word otk
        if (!identity && username) {
          await lastPageStorage.clear();
          history.push({
            pathname: akashicPayPath(urls.migrateWalletNotice),
            state: { migrateWallet: { username } },
          });
        } else if (identity) {
          const fullOtk = { ...otk, identity };
          await lastPageStorage.clear();
          await lastPageStorage.store(
            urls.createWalletPassword,
            NavigationPriority.IMMEDIATE,
            {
              otk: fullOtk,
            }
          );
          setPrivateKey(undefined);
          setAlert(formAlertResetState);
          history.push({
            pathname: akashicPayPath(urls.createWalletPassword),
            state: {
              createPassword: {
                isImport: true,
              },
            },
          });
        } else {
          throw new Error(t('GenericFailureMsg'));
        }
      }
    } catch (error) {
      datadogRum.addError(error);
      setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
    }
  }

  const CancelButton = (
    <IonCol>
      <ResetPageButton
        expand="block"
        callback={() => {
          // Reset view and navigate back up the stack
          historyGoBack(history, true);
          isPlatform('mobile') && location.reload();
        }}
      />
    </IonCol>
  );

  return (
    <PublicLayout className="vertical-center">
      <IonRow>
        <IonCol>
          <h2>{t('ImportWallet')}</h2>
        </IonCol>
      </IonRow>

      <>
        <IonRow>
          <IonCol>
            <h6>{t('EnterKeyPair')}</h6>
          </IonCol>
        </IonRow>
        <IonRow style={{ marginTop: '40px' }}>
          <IonCol>
            <StyledInput
              label={t('KeyPair')}
              type={'text'}
              value={privateKey}
              placeholder={t('EnterKeyPair')}
              onIonInput={({ target: { value } }) => {
                setPrivateKey(value as string);
                setAlert(formAlertResetState);
              }}
              submitOnEnter={requestImport}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton
              disabled={!privateKey}
              onClick={requestImport}
              expand="block"
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          {CancelButton}
        </IonRow>
        <IonRow style={{ marginTop: '24px' }}>
          <AlertBox state={alert} />
        </IonRow>
      </>
    </PublicLayout>
  );
}
