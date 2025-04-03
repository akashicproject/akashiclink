import { IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { PurpleButton } from '../components/buttons';
import { LoggedLayout } from '../components/layout/logged-layout';
import { MainGrid } from '../components/layout/main-grid';
import { useLogout } from '../components/logout';
import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tabs';
import { OwnersAPI } from '../utils/api';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { ResetPageButton } from '../utils/last-page-storage';

export function SettingsDelete() {
  const { t } = useTranslation();
  const logout = useLogout();
  const { activeAccount, removeLocalAccount } = useAccountStorage();
  const history = useHistory();
  const [alert, setAlert] = useState(formAlertResetState);

  /**
   * Submit request to display private key - requires password
   */
  const deleteAccount = async () => {
    try {
      await OwnersAPI.deleteAccount();
      activeAccount && removeLocalAccount(activeAccount);
      await logout();
    } catch (e) {
      setAlert(errorAlertShell('GenericFailureMsg'));
    }
  };

  return (
    <LoggedLayout isToolBar={false}>
      <CustomAlert state={alert} />
      <MainGrid style={{ padding: '112px 48px', gap: '24px' }}>
        <IonRow>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
            {t('AreYouSureDelete')}
          </h2>
          <h5 style={{ margin: '0px', fontWeight: '400' }}>
            {t('FundsLeftNotRecoverable')}
          </h5>
        </IonRow>
        <IonRow>
          <PurpleButton style={{ width: '100%' }} onClick={deleteAccount}>
            {t('Delete')}{' '}
          </PurpleButton>
        </IonRow>
        <IonRow>
          <ResetPageButton
            style={{ width: '100%' }}
            callback={() => {
              history.push(akashicPayPath(urls.loggedFunction));
            }}
          />
        </IonRow>
      </MainGrid>
    </LoggedLayout>
  );
}
