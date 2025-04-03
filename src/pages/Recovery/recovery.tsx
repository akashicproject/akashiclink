import { IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';

export function Recovery() {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>{t('PleaseEnterYourEmail')}</MainTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <StyledInput
              label={t('Email')}
              type={'email'}
              placeholder={t('Enter your email')}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton
              routerLink={akashicPayPath(urls.verification)}
              expand="block"
            >
              {t('Send')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </MainLayout>
  );
}
