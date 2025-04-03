import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { WhiteButton } from '../components/buttons';
import { LoggedLayout } from '../components/layout/logged-layout';
import { MainGrid } from '../components/layout/main-grid';
import { useLogout } from '../components/logout';
import { OwnersAPI } from '../utils/api';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';

export function SettingsDelete() {
  const { t } = useTranslation();
  const logout = useLogout();
  const { activeAccount, removeLocalAccount } = useAccountStorage();

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
    <LoggedLayout>
      <CustomAlert state={alert} />

      <MainGrid className="force-center">
        <IonRow>
          <IonCol>
            <h2>{t('AreYouSureDelete')}</h2>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <h3>{t('FundsLeftNotRecoverable')}</h3>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <WhiteButton onClick={deleteAccount}>{t('Delete')} </WhiteButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </LoggedLayout>
  );
}
