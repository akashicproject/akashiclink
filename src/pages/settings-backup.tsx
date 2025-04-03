import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { ConfirmLockPassword } from '../components/confirm-lock-password';
import { LoggedLayout } from '../components/layout/logged-layout';
import { MainGrid } from '../components/layout/main-grid';
import { OtkBox } from '../components/otk-box/otk-box';
import { OwnersAPI } from '../utils/api';

export enum BackupKeyPairState {
  ConfirmPassword,
  ViewKeyPair,
}

export function SettingsBackup() {
  const { t } = useTranslation();

  const [view, setView] = useState(BackupKeyPairState.ConfirmPassword);
  const [keyPair, setKeyPair] = useState('');
  const [alert, setAlert] = useState(formAlertResetState);

  /**
   * Submit request to display private key - requires password
   */
  const fetchKeyPair = async (password: string) => {
    try {
      const { otkPrv } = await OwnersAPI.fetchKeyPair({ password });
      if (otkPrv) {
        setKeyPair(otkPrv);
        setView(BackupKeyPairState.ViewKeyPair);
      }
    } catch (e) {
      setAlert(errorAlertShell(t('InvalidPassword')));
    }
  };

  return (
    <LoggedLayout>
      <Alert state={alert} />
      {view === BackupKeyPairState.ConfirmPassword && (
        <ConfirmLockPassword setVal={fetchKeyPair} />
      )}
      {view === BackupKeyPairState.ViewKeyPair && (
        <MainGrid className="force-center">
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
