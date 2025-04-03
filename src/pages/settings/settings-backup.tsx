import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertBox } from '../../components/common/alert/alert';
import { OtkBox } from '../../components/otk-box/otk-box';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import {
  PageHeader,
  SettingsWrapper,
} from '../../components/settings/base-components';
import { ConfirmLockPassword } from '../../components/settings/confirm-lock-password';
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
    <DashboardLayout>
      {view === BackupKeyPairState.ConfirmPassword && (
        <ConfirmLockPassword onPasswordCheckSuccess={onPasswordCheckSuccess} />
      )}
      {view === BackupKeyPairState.ViewKeyPair && (
        <SettingsWrapper>
          <PageHeader>{t('ThisIsYourKeyPair')}</PageHeader>
          <IonGrid fixed className="ion-no-padding">
            <IonRow>
              <IonCol className="ion-no-padding">
                <OtkBox label="" text={keyPair} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="ion-center ion-no-padding">
                <AlertBox
                  state={{
                    visible: true,
                    success: false,
                    message: t('KeyPairWarning'),
                  }}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </SettingsWrapper>
      )}
    </DashboardLayout>
  );
}
