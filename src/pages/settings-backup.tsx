import './common.css';

import styled from '@emotion/styled';
import { IonCol, IonImg, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { PurpleButton, WhiteButton } from '../components/buttons';
import { ConfirmLockPassword } from '../components/confirm-lock-password';
import { Copy } from '../components/copy/copy';
import { DividerDiv } from '../components/layout/divider';
import { LoggedLayout } from '../components/layout/logged-layout';
import { MainGrid } from '../components/layout/main-grid';
import { MainTitle } from '../components/layout/main-title';
import { OwnersAPI } from '../utils/api';

const WarningText = styled.span({
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Nunito Sans',
  color: 'red',
});

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
        <MainGrid>
          <IonRow>
            <IonCol class="ion-center">
              <MainTitle>This is your KeyPair</MainTitle>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="ion-center">
              <IonImg alt="dummy QE" src="/shared-assets/images/QR_US².png" />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <Copy text={keyPair} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="ion-center">
              <WarningText>
                Warning: Never disclose this key. Anyone with your private keys
                can steal any assets held in your account.
              </WarningText>
            </IonCol>
          </IonRow>
          <IonRow class="ion-center">
            <DividerDiv />
          </IonRow>
          <IonRow>
            <IonCol>
              <WhiteButton expand="block">
                View Account at Akashicscan.com
              </WhiteButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <PurpleButton expand="block">Export KeyPair</PurpleButton>
            </IonCol>
          </IonRow>
        </MainGrid>
      )}
    </LoggedLayout>
  );
}
