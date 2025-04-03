import './create-wallet.css';

import { IonChip, IonCol, IonRow } from '@ionic/react';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { DividerDiv } from '../../components/layout/divider';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { StyledInput } from '../../components/styled-input';

export function WalletCreated() {
  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>Wallet Created!</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonChip class={'wallet-address-chip'}>
              Wallet Address: 0000000000
            </IonChip>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <DividerDiv />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <WhiteButton expand="block">Option Backup</WhiteButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={'Email'}
              type={'email'}
              placeholder={'Enter your email'}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton expand="block">Send</PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </MainLayout>
  );
}
