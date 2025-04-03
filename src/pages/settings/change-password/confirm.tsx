import { IonCol, IonImg, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../../components/common/buttons';
import { MainGrid } from '../../../components/layout/main-grid';
import { DashboardLayout } from '../../../components/page-layout/dashboard-layout';
import { useLogout } from '../../../utils/hooks/useLogout';
import { HeaderTitle, HeaderWrapper } from '../../send/send-result';

export function ChangePasswordConfirm() {
  const { t } = useTranslation();
  const logout = useLogout();

  return (
    <DashboardLayout>
      <MainGrid style={{ padding: '56px 32px' }}>
        <IonRow>
          <IonCol class="ion-center">
            <HeaderWrapper>
              <IonImg
                alt={''}
                src={'/shared-assets/images/right.png'}
                style={{ width: '40px', height: '40px' }}
              />
              <HeaderTitle style={{ width: '139px' }}>
                {t('PasswordChangeSuccess')}
              </HeaderTitle>
            </HeaderWrapper>
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
