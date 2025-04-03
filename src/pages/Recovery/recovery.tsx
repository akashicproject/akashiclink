import { IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';

export function Recovery() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <MainGrid>
        <IonRow>
          <IonCol>
            <h2>{t('PleaseEnterYourEmail')}</h2>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
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
    </PublicLayout>
  );
}
