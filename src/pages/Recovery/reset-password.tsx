import { IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';

export function ResetPassword() {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>{t('SetYourLockPassword')}</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <StyledInput
              label={'New Password'}
              type={'password'}
              placeholder={t('EnterYourNewPassword')}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <StyledInput
              label={t('ConfirmPassword')}
              type={'password'}
              placeholder={t('ConfirmYourPassword')}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton
              routerLink={heliumPayPath(urls.createWalletUrl)}
              expand="block"
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </MainLayout>
  );
}
