import { IonCol, IonRow, useIonRouter } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../components/buttons';
import { DividerDiv } from '../components/layout/divider';
import { MainGrid } from '../components/layout/main-grid';
import { MainTitle } from '../components/layout/main-title';
import { MainLayout } from '../components/layout/mainLayout';
import { StyledInput } from '../components/styled-input';
import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';
import { OwnersAPI } from '../utils/api';
import { storeAccount } from '../utils/local-storage';

export function ImportWallet() {
  const router = useIonRouter();
  const { t } = useTranslation();

  const [keyPair, setKeyPair] = useState<string>();
  const [password, setPassword] = useState<string>();

  async function importWalletRequest() {
    if (keyPair && password) {
      const importedWallet = await OwnersAPI.importWallet({
        otkPrv: keyPair,
        password,
      });

      storeAccount(importedWallet);

      router.push(heliumPayPath(urls.loggedFunction));
      return;
    }
    console.log('Failed login!');
  }

  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>{t('LoginWithExistingCredential')}</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <DividerDiv />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={t('KeyPair')}
              type={'text'}
              placeholder={t('EnterKeyPair')}
              onIonInput={({ target: { value } }) =>
                setKeyPair(value as string)
              }
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={t('Password')}
              type={'password'}
              placeholder={t('EnterPassword')}
              onIonInput={({ target: { value } }) =>
                setPassword(value as string)
              }
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton onClick={importWalletRequest} expand="block">
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </MainLayout>
  );
}
