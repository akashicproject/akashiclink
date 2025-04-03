import { IonCol, IonRow } from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertBox } from '../../components/alert/alert';
import { ConfirmLockPassword } from '../../components/confirm-lock-password';
import { LoggedLayout } from '../../components/layout/logged-layout';
import { MainGrid } from '../../components/layout/main-grid';
import { OtkBox } from '../../components/otk-box/otk-box';
import type { FullOtk } from '../../utils/otk-generation';

export enum BackupKeyPairState {
  ConfirmPassword,
  ViewKeyPair,
}

export function SettingsBackup() {
  const { t } = useTranslation();

  const [view, setView] = useState(BackupKeyPairState.ConfirmPassword);
  const [keyPair, setKeyPair] = useState('');

  const onPasswordCheckSuccess = (otk: FullOtk) => {
    setKeyPair(otk.key.prv.pkcs8pem);
    setView(BackupKeyPairState.ViewKeyPair);
  };

  return (
    <LoggedLayout>
      {view === BackupKeyPairState.ConfirmPassword && (
        <ConfirmLockPassword onPasswordCheckSuccess={onPasswordCheckSuccess} />
      )}
      {view === BackupKeyPairState.ViewKeyPair && (
        <MainGrid style={{ padding: '56px 48px' }}>
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
