import { IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/buttons';
import { CountdownDiv } from '../../components/layout/countdown';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';

export function Verification() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <MainGrid>
        <IonRow>
          <IonCol>
            <h2>{t('VerificationCode')}</h2>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <CountdownDiv>10</CountdownDiv>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <StyledInput
              label={t('VerificationCode')}
              type={'text'}
              placeholder={t('EnterTheCodeSent')}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton
              routerLink={akashicPayPath(urls.resetPassword)}
              expand="block"
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
