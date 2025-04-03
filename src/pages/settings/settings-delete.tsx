import { datadogRum } from '@datadog/browser-rum';
import { IonCol, IonRow, IonText } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { LoggedLayout } from '../../components/layout/logged-layout';
import { MainGrid } from '../../components/layout/main-grid';
import { Spinner } from '../../components/loader/spinner';
import { useLogout } from '../../components/logout';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';

export function SettingsDelete() {
  const { t } = useTranslation();
  const logout = useLogout();
  const { activeAccount, removeLocalAccount, clearActiveAccount } =
    useAccountStorage();
  const history = useHistory();
  const [alert, setAlert] = useState(formAlertResetState);
  const [isLoading, setIsLoading] = useState(false);
  /**
   * Submit request to display private key - requires password
   */
  const deleteAccount = async () => {
    try {
      setIsLoading(true);
      if (activeAccount) {
        await removeLocalAccount(activeAccount);
        await clearActiveAccount();
      }
      await logout();
    } catch (e) {
      datadogRum.addError(e);
      setAlert(errorAlertShell('GenericFailureMsg'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <LoggedLayout>
      <MainGrid style={{ padding: '56px 48px' }}>
        <IonRow className={'ion-grid-row-gap-lg ion-center'}>
          <IonCol size="12">
            <h2 className={'ion-text-align-center'}>{t('AreYouSureDelete')}</h2>
            <IonText className={'ion-text-align-center ion-text-size-xs'}>
              <p>{t('FundsLeftNotRecoverable')}</p>
            </IonText>
          </IonCol>
          <IonCol size="12">
            <PurpleButton expand="block" onClick={deleteAccount}>
              {t('Delete')}
            </PurpleButton>
          </IonCol>
          <IonCol size="12">
            <WhiteButton
              style={{ width: '100%' }}
              fill="clear"
              onClick={() => {
                history.push(akashicPayPath(urls.loggedFunction));
              }}
            >
              {t('Cancel')}
            </WhiteButton>
          </IonCol>
        </IonRow>
        {alert.visible && <CustomAlert state={alert} />}
      </MainGrid>
    </LoggedLayout>
  );
}
