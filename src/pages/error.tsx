import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../components/common/buttons';
import { DashboardLayout } from '../components/page-layout/dashboard-layout';
import { urls } from '../constants/urls';

export const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <IonGrid>
        <IonRow>
          <IonCol size="12" className="ion-text-center">
            <IonText>
              <h2>{t('ErrorPageHeading')}</h2>
            </IonText>
          </IonCol>
          <IonCol size="12" className="ion-text-center">
            <IonText>
              <p>{t('ErrorPageDesc')}</p>
            </IonText>
          </IonCol>
          <IonCol size="12" className="ion-text-center">
            <PurpleButton routerLink={urls.dashboard}>
              {t('ErrorPageBackButton')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </DashboardLayout>
  );
};
