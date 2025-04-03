import {
  activationCodeRegex,
  ActivationRequestType,
  userConst,
} from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonRow } from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { ActivationTimer } from '../../components/activation/activation-timer';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import {
  PurpleButton,
  TextButton,
  WhiteButton,
} from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { OwnersAPI } from '../../utils/api';
import { useOwner } from '../../utils/hooks/useOwner';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
} from '../../utils/last-page-storage';

export function ChangePasswordTwoFa() {
  const { i18n, t } = useTranslation();
  const { owner } = useOwner();
  const history = useHistory<LocationState>();
  const state = history.location.state?.changePassTwoFa;

  // When first entering this page from 1st part of change-password
  //    -> Store variables so they are saved if user soft-closes
  if (state) {
    lastPageStorage.store(
      urls.changePassword2FA,
      NavigationPriority.AWAIT_AUTHENTICATION,
      {
        oldPassword: state?.oldPassword,
        newPassword: state?.newPassword,
        confirmPassword: state?.confirmPassword,
        email: state?.email,
      }
    );
  }

  /** Tracking user input */
  const [oldPassword, setOldPassword] = useState(state?.oldPassword);
  const [newPassword, setNewPassword] = useState(state?.newPassword);
  const [confirmPassword, setConfirmPassword] = useState(
    state?.confirmPassword
  );
  const [email, setEmail] = useState<string>(state?.email ?? '');
  const [activationCode, setActivationCode] = useState<string>();
  const validateActivationCode = (value: string) =>
    !!value.match(activationCodeRegex);

  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const validateConfirmPassword = (value: string) => newPassword === value;

  const emailSentAlert = {
    success: true,
    visible: true,
    message: t('ConfirmEmailSent', { email }),
  };
  const [alertRequest, setAlertRequest] = useState(emailSentAlert);

  /**
   * Countdown showing validity of activation code
   */
  const [timerReset, setTimerReset] = useState(0);

  // When re-entering page after close, set all the needed states from local storage
  // TODO: Find out how to keep timer after soft-close
  useEffect(() => {
    cacheCurrentPage(
      urls.changePassword2FA,
      NavigationPriority.AWAIT_AUTHENTICATION,
      async () => {
        const data = await lastPageStorage.getVars();
        console.log('cachecurrent', data);
        if (data.email) {
          setEmail(data.email);
          setNewPassword(data.newPassword);
          setOldPassword(data.oldPassword);
          setConfirmPassword(data.confirmPassword);
        }
      }
    );
  }, []);

  /**
   * Activation request is sent -> email with activation code is sent to user
   */
  async function requestImportAccount() {
    try {
      if (newPassword) {
        const { email } = await OwnersAPI.requestActivationCode({
          activationType: ActivationRequestType.PasswordChange,
          payload: { email: owner.email },
          lang: i18n.language as Language,
        });
        if (!email) {
          setAlertRequest(errorAlertShell(t('UserDoesNotExist')));
          return;
        }
        setEmail(email);
        setTimerReset(timerReset + 1);
        setAlertRequest(emailSentAlert);
      }
    } catch (e) {
      let message = t('GenericFailureMsg');
      if (axios.isAxiosError(e)) message = e.response?.data?.message || message;
      setAlertRequest(errorAlertShell(message));
    }
  }

  async function submitChangePassword() {
    if (
      !(
        activationCode &&
        oldPassword &&
        newPassword &&
        confirmPassword &&
        email
      )
    )
      return;

    if (
      validateConfirmPassword(confirmPassword) &&
      validatePassword(newPassword)
    ) {
      try {
        await OwnersAPI.changePassword({
          newPassword,
          password: oldPassword,
          email,
          lang: i18n.language as Language,
          activationCode,
        });

        setAlertRequest(formAlertResetState);
        history.push(akashicPayPath(urls.changePasswordConfirm));
      } catch (e) {
        let message = t('GenericFailureMsg');
        if (axios.isAxiosError(e))
          message = e.response?.data?.message || message;
        setAlertRequest(errorAlertShell(message));
      }
    } else setAlertRequest(errorAlertShell(t('PasswordHelperText')));
  }

  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow>
          <IonCol>
            <h2>{t('ChangePassword')}</h2>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <StyledInput
              label="Email"
              type="email"
              placeholder=""
              disabled={true}
              value={email}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <ActivationTimer resetTrigger={timerReset} />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <TextButton disabled={!newPassword} onClick={requestImportAccount}>
              <h4>
                <u>{t('SendNewCode')}</u>
              </h4>
            </TextButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <AlertBox state={alertRequest} />
        </IonRow>
        <IonRow>
          <IonCol>
            <StyledInput
              label={t('ActivationCode')}
              placeholder={t('PleaseEnterCode')}
              onIonInput={({ target: { value } }) => {
                setActivationCode(value as string);
              }}
              errorPrompt={StyledInputErrorPrompt.ActivationCode}
              validate={validateActivationCode}
              submitOnEnter={submitChangePassword}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <WhiteButton
              expand="block"
              onClick={async () => {
                setActivationCode(undefined);
                history.goBack();
              }}
            >
              {t('Cancel')}
            </WhiteButton>
          </IonCol>
          <IonCol>
            <PurpleButton
              expand="block"
              disabled={!activationCode}
              onClick={submitChangePassword}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
