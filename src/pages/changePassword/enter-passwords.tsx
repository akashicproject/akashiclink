import { userConst } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import {
  cacheCurrentPage,
  ResetPageButton,
} from '../../utils/last-page-storage';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function ChangePassword() {
  const { t } = useTranslation();
  const history = useHistory();
  const { activeAccount } = useAccountStorage();

  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const validateConfirmPassword = (value: string) => newPassword === value;

  const [alertRequest, setAlertRequest] = useState(formAlertResetState);
  const { changeOtkPassword } = useAccountStorage();

  useEffect(() => {
    cacheCurrentPage(urls.changePassword);
  }, []);
  /**
     * Activation request is sent -> email with activation code is sent to user
  
     */
  async function changePassword() {
    if (newPassword && oldPassword) {
      try {
        await changeOtkPassword(
          activeAccount!.identity!,
          oldPassword,
          newPassword
        );
        history.push(akashicPayPath(urls.changePasswordConfirm));
      } catch (error) {
        setAlertRequest(errorAlertShell(t(unpackRequestErrorMessage(error))));
      }
    }
  }

  /**
   * Drop any intermediate state and redirect to landing page
   */
  const ResetButton = (
    <IonCol>
      <ResetPageButton
        expand="block"
        callback={() => {
          history.push(akashicPayPath(urls.loggedFunction));
        }}
      />
    </IonCol>
  );
  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow>
          <IonCol>
            <h2>{t('ChangePassword')}</h2>
          </IonCol>
        </IonRow>
        <IonRow style={{ marginBottom: '40px' }}>
          <IonCol>
            <h6>{t('ChangePasswordInfo')}</h6>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <StyledInput
              label={t('OldPassword')}
              placeholder={t('EnterPassword')}
              type="password"
              onIonInput={({ target: { value } }) =>
                setOldPassword(value as string)
              }
              value={oldPassword}
              errorPrompt={StyledInputErrorPrompt.Password}
              validate={validatePassword}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={t('NewPassword')}
              placeholder={t('EnterPassword')}
              type="password"
              onIonInput={({ target: { value } }) =>
                setNewPassword(value as string)
              }
              value={newPassword}
              errorPrompt={StyledInputErrorPrompt.Password}
              validate={validatePassword}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={t('ConfirmPassword')}
              type="password"
              placeholder={t('ConfirmPassword')}
              onIonInput={({ target: { value } }) =>
                setConfirmPassword(value as string)
              }
              value={confirmPassword}
              errorPrompt={StyledInputErrorPrompt.ConfirmPassword}
              validate={validateConfirmPassword}
              submitOnEnter={changePassword}
            />
          </IonCol>
        </IonRow>
        {alertRequest.visible && <AlertBox state={alertRequest} />}
        <IonRow>
          {ResetButton}
          <IonCol>
            <PurpleButton
              expand="block"
              onClick={changePassword}
              disabled={!oldPassword || !newPassword || !confirmPassword}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
