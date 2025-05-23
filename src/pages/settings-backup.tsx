import { datadogRum } from '@datadog/browser-rum';
import { IonCol, IonRow } from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertBox,
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { ConfirmLockPassword } from '../components/confirm-lock-password';
import { LoggedLayout } from '../components/layout/logged-layout';
import { MainGrid } from '../components/layout/main-grid';
import { OtkBox } from '../components/otk-box/otk-box';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';

export enum BackupKeyPairState {
  ConfirmPassword,
  ViewKeyPair,
}

export function SettingsBackup() {
  const { t } = useTranslation();

  const [view, setView] = useState(BackupKeyPairState.ConfirmPassword);
  const [keyPair, setKeyPair] = useState('');
  const [alert, setAlert] = useState(formAlertResetState);
  const { getLocalOtk, activeAccount } = useAccountStorage();

  /**
   * Submit request to display private key - requires password
   */
  const fetchKeyPair = async (password: string) => {
    try {
      const otk = await getLocalOtk(activeAccount!.identity!, password);
      if (otk) {
        setKeyPair(otk.key.prv.pkcs8pem);
        setView(BackupKeyPairState.ViewKeyPair);
      }
    } catch (e) {
      datadogRum.addError(e);
      setAlert(errorAlertShell(t('InvalidPassword')));
    }
  };

  return (
    <LoggedLayout>
      <CustomAlert state={alert} />
      {view === BackupKeyPairState.ConfirmPassword && (
        <ConfirmLockPassword setVal={fetchKeyPair} />
      )}
      {view === BackupKeyPairState.ViewKeyPair && (
        <MainGrid>
          <IonRow>
            <IonCol>
              <h2>{t('ThisIsYourKeyPair')}</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <OtkBox label="" text={keyPair} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="ion-center">
              <AlertBox
                state={{
                  visible: true,
                  success: false,
                  message: t('KeyPairWarning'),
                }}
              />
            </IonCol>
          </IonRow>
        </MainGrid>
      )}
    </LoggedLayout>
  );
}
