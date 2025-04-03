import { ActivationRequestType, userConst } from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonRow } from '@ionic/react';
import axios from 'axios';
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
import { akashicPayPath } from '../../routing/navigation-tree';
import { OwnersAPI } from '../../utils/api';
import { useOwner } from '../../utils/hooks/useOwner';
import {
  cacheCurrentPage,
  ResetPageButton,
} from '../../utils/last-page-storage';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function ChangePassword() {
  const { i18n, t } = useTranslation();
  const history = useHistory();
  const { owner } = useOwner();

  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const validateConfirmPassword = (value: string) => newPassword === value;

  const [alertRequest, setAlertRequest] = useState(formAlertResetState);

  useEffect(() => {
    cacheCurrentPage(urls.changePassword);
  }, []);

  /**
   * Countdown showing validity of activation code
   */
  const [timerReset, setTimerReset] = useState(0);
  /**
     * Activation request is sent -> email with activation code is sent to user
  
     */
  async function requestImportAccount() {
    try {
      if (newPassword && oldPassword) {
        const { email } = await OwnersAPI.requestActivationCode({
          activationType: ActivationRequestType.PasswordChange,
          payload: { email: owner.email },
          lang: i18n.language as Language,
        });
        if (!email) {
          setAlertRequest(errorAlertShell(t('UserDoesNotExist')));
          return;
        }
        setTimerReset(timerReset + 1);
        setNewPassword('');
        setOldPassword('');
        setConfirmPassword('');
        history.push({
          pathname: akashicPayPath(urls.changePassword2FA),
          state: {
            changePassTwoFa: {
              oldPassword,
              newPassword,
              confirmPassword,
              email,
            },
          },
        });
      }
    } catch (e) {
      let message = t('GenericFailureMsg');
      if (axios.isAxiosError(e)) message = e.response?.data?.message || message;
      setAlertRequest(errorAlertShell(message));
    }
  }

  async function confirmOldPassword() {
    if (oldPassword) {
      try {
        await OwnersAPI.confirmPassword({
          username: owner.username,
          password: oldPassword,
        });
        // Call for verification email to be sent (if login doesn't error)
        requestImportAccount();
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error?.response?.data?.message === userConst.invalidUserErrorMsg
        ) {
          setAlertRequest(errorAlertShell(t('OldPasswordIncorrect')));
        } else if (axios.isAxiosError(error)) {
          setAlertRequest(errorAlertShell(t(unpackRequestErrorMessage(error))));
        } else {
          setAlertRequest(errorAlertShell(t('GenericFailureMsg')));
        }
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
              submitOnEnter={confirmOldPassword}
            />
          </IonCol>
        </IonRow>
        {alertRequest.visible && <AlertBox state={alertRequest} />}
        <IonRow>
          {ResetButton}
          <IonCol>
            <PurpleButton
              expand="block"
              onClick={confirmOldPassword}
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
