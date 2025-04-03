import './create-wallet.css';

import { IonChip, IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { DividerDiv } from '../../components/layout/divider';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { StyledInput } from '../../components/styled-input';

export function WalletCreated() {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>{t('WalletCreated')}</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonChip class={'wallet-address-chip'}>
              {t('WalletAddress')}: 0000000000
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
            <WhiteButton expand="block">{t('OptionBackup')}</WhiteButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={t('Email')}
              type={'email'}
              placeholder={t('EnterYourEmail')}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton expand="block">{t('Send')}</PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </MainLayout>
  );
}
