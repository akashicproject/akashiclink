import './common.css';

import styled from '@emotion/styled';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
} from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import { useState } from 'react';

import { PurpleButton, WhiteButton } from '../components/buttons';
import { ConfirmLockPassword } from '../components/confirm-lock-password';
import { DividerDiv } from '../components/layout/divider';
import { LoggedLayout } from '../components/layout/loggedLayout';
import { MainGrid } from '../components/layout/main-grid';
import { MainTitle } from '../components/layout/main-title';
import { OwnersAPI } from '../utils/api';

const CopyText = styled.span({
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Nunito Sans',
  color: 'var(--ion-color-dark)',
});

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
  const [view, setView] = useState(BackupKeyPairState.ConfirmPassword);
  const [keyPair, setKeyPair] = useState('');

  const fetchKeyPair = async (password: string) => {
    const { otkPrv } = await OwnersAPI.fetchKeyPair({ password });
    if (otkPrv) {
      setKeyPair(otkPrv);
      setView(BackupKeyPairState.ViewKeyPair);
    }
  };

  return (
    <IonPage>
      <LoggedLayout>
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
                <IonItem
                  lines="none"
                  style={{
                    backgroundColor: 'none',
                  }}
                >
                  <IonLabel
                    style={{
                      border: '1px solid var(--ion-color-dark)',
                      borderRadius: '4px',
                      margin: '10px',
                      padding: '10px',
                      height: '80%',
                    }}
                  >
                    <IonText class="ion-text-wrap" color="dark">
                      <CopyText>{keyPair}</CopyText>
                    </IonText>
                  </IonLabel>
                  <IonButton
                    class="icon-button"
                    onClick={() => navigator.clipboard.writeText(keyPair)}
                  >
                    <IonIcon
                      slot="icon-only"
                      class="icon-button-icon"
                      icon={copyOutline}
                    />
                  </IonButton>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="ion-center">
                <WarningText>
                  Warning: Never disclose this key. Anyone with your private
                  keys can steal any assets held in your account.
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
    </IonPage>
  );
}
