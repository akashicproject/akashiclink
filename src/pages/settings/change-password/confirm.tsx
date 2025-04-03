import { IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../../components/common/buttons';
import { SuccessfulIconWithTitle } from '../../../components/common/state-icon-with-title/successful-icon-with-title';
import { MainGrid } from '../../../components/layout/main-grid';
import { DashboardLayout } from '../../../components/page-layout/dashboard-layout';
import { useLogout } from '../../../utils/hooks/useLogout';

export function ChangePasswordConfirm() {
  const { t } = useTranslation();
  const logout = useLogout();

  return (
    <DashboardLayout>
      <MainGrid style={{ padding: '56px 32px' }}>
        <IonRow>
          <IonCol size="12" class="ion-center">
            <SuccessfulIconWithTitle title={t('PasswordChangeSuccess')} />
          </IonCol>
        </IonRow>
        <PurpleButton
          expand="block"
          onClick={logout}
          style={{ marginTop: '40px' }}
        >
          {t('Confirm')}
        </PurpleButton>
      </MainGrid>
    </DashboardLayout>
  );
}
