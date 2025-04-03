import type { IActivateWalletAccountResponse } from '@helium-pay/backend';
import {
  activationCodeRegex,
  ActivationRequestType,
  userConst,
} from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonRow, isPlatform } from '@ionic/react';
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
import { PurpleButton, TextButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { useLogout } from '../../components/logout';
import { OtkBox } from '../../components/otk-box/otk-box';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { OwnersAPI } from '../../utils/api';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../../utils/last-page-storage';
import { CreatingWallet } from './creating-wallet';

enum CreateWalletView {
  RequestAccount = 'RequestAccount',
  ActivateAccount = 'ActivateAccount',
  AccountCreated = 'AccountCreated',
}

export const createWalletUrl = 'create-wallet';

export function CreateWallet() {
  const { i18n, t } = useTranslation();
  const history = useHistory();
  const logout = useLogout();

  useEffect(() => {
    cacheCurrentPage(
      createWalletUrl,
      NavigationPriority.IMMEDIATE,
      async () => {
        const { email } = await lastPageStorage.getVars();
        if (email) {
          setEmail(email);
          setView(CreateWalletView.ActivateAccount);
        }
      }
    );
  }, []);

  const [view, setView] = useState(CreateWalletView.RequestAccount);

  /** Tracking user input */
  const [email, setEmail] = useState<string>();
  const validateEmail = (value: string) => !!value.match(userConst.emailRegex);
  const [activationCode, setActivationCode] = useState<string>();
  const validateActivationCode = (value: string) =>
    !!value.match(activationCodeRegex);
  const [password, setPassword] = useState<string>();
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const validateConfirmPassword = (value: string) => password === value;

  /** Tracking response from server after account is created */
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [newAccount, setNewAccount] =
    useState<IActivateWalletAccountResponse>();

  const emailSentAlert = {
    success: true,
    visible: true,
    message: t('ConfirmEmailSent', { email }),
  };
  const [alertRequest, setAlertRequest] = useState(formAlertResetState);
  const [alertActivate, setAlertActivate] = useState(emailSentAlert);
  const { addLocalAccount, setActiveAccount } = useAccountStorage();

  /**
   * Countdown showing validity of activation code
   */
  const [timerReset, setTimerReset] = useState(0);

  /**
   * Activation request is sent -> email with activation code is sent to user
   * Page is saved - this way user can resume activation after switching
   * to check email which minimises the extension
   */
  async function requestWalletAccount() {
    if (!email) return;
    const emailValid = validateEmail(email);
    if (emailValid) {
      try {
        const response = await OwnersAPI.requestActivationCode({
          activationType: ActivationRequestType.CreateWalletAccount,
          lang: i18n.language as Language,
          payload: { email },
        });

        // Email already taken
        if (!('email' in response)) {
          setAlertRequest(errorAlertShell(t('EmailAlreadyUsed')));
          return;
        }

        // Store the state - user will likely click away at this point to copy
        // over the activation code
        lastPageStorage.store(createWalletUrl, NavigationPriority.IMMEDIATE, {
          email,
        });
        setView(CreateWalletView.ActivateAccount);

        // Launch countdown while code is valid
        setTimerReset(timerReset + 1);
        setAlertRequest(formAlertResetState);
        setAlertActivate(emailSentAlert);
      } catch (e) {
        setAlertRequest(errorAlertShell(t('GenericFailureMsg')));
      }
    } else setAlertRequest(errorAlertShell(t('InvalidEmail')));
  }

  /**
   * Code in email is submitted to backend along with password to use
   * Wallets are created and user is moved to "Activation" screen
   * TODO: add helper text re password requirements and passwords not matching
   */
  async function activateWalletAccount() {
    if (!(activationCode && password && confirmPassword && email)) return;

    if (
      validateConfirmPassword(confirmPassword) &&
      validatePassword(password)
    ) {
      // Submit request and display "creating account loader"
      setCreatingAccount(true);

      try {
        const createAccountResponse = await OwnersAPI.activateNewAccount({
          lang: i18n.language as Language,
          password,
          confirmPassword,
          activationCode,
          email,
          // TODO: add proper social recovery
          socialRecoveryEmail: 'test@mail.com',
        });

        // Complete the create-wallet flow
        await lastPageStorage.clear();

        // Set new account details and display summary screen
        const newAccount = {
          identity:
            createAccountResponse.identity || createAccountResponse.username,
          username: createAccountResponse.username,
        };
        setNewAccount(createAccountResponse);
        addLocalAccount(newAccount);
        setActiveAccount(newAccount);
        setView(CreateWalletView.AccountCreated);
        setAlertRequest(formAlertResetState);
        setAlertActivate(formAlertResetState);
      } catch (e) {
        let message = t('GenericFailureMsg');
        if (axios.isAxiosError(e))
          message = e.response?.data?.message || message;
        setAlertActivate(errorAlertShell(message));
      } finally {
        setCreatingAccount(false);
      }
    } else setAlertActivate(errorAlertShell(t('PasswordHelperText')));
  }

  /**
   * Drop any intermediate state and redirect to landing page
   */
  const ResetButton = (
    <IonCol>
      <ResetPageButton
        expand="block"
        callback={() => {
          setView(CreateWalletView.RequestAccount);
          history.push('/');
          isPlatform('mobile') && location.reload();
        }}
      />
    </IonCol>
  );

  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        {view !== CreateWalletView.AccountCreated && (
          <IonRow>
            <IonCol>
              <h2>{t('CreateYourWallet')}</h2>
            </IonCol>
          </IonRow>
        )}
        {view === CreateWalletView.RequestAccount && (
          <>
            <IonRow style={{ marginBottom: '40px' }}>
              <IonCol>
                <h6>{t('EnterEmailToCreateAccount')}</h6>
              </IonCol>
            </IonRow>
          </>
        )}
        {(view === CreateWalletView.RequestAccount ||
          view === CreateWalletView.ActivateAccount) && (
          <IonRow>
            <IonCol>
              <StyledInput
                label="Email"
                type="email"
                placeholder={email || t('EnterYourEmail')}
                onIonInput={({ target: { value } }) => {
                  setEmail(value as string);
                  setAlertRequest(formAlertResetState);
                }}
                errorPrompt={StyledInputErrorPrompt.Email}
                validate={validateEmail}
                disabled={view === CreateWalletView.ActivateAccount}
                submitOnEnter={requestWalletAccount}
              />
            </IonCol>
          </IonRow>
        )}
        {creatingAccount && <CreatingWallet />}
        {view === CreateWalletView.RequestAccount && (
          <>
            <IonRow>
              {ResetButton}
              <IonCol>
                <PurpleButton
                  expand="block"
                  onClick={requestWalletAccount}
                  disabled={!email}
                >
                  {t('SendCode')}
                </PurpleButton>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '24px' }}>
              <AlertBox state={alertRequest} />
            </IonRow>
          </>
        )}
        {view === CreateWalletView.ActivateAccount && (
          <>
            <IonRow>
              <IonCol class="ion-center">
                <ActivationTimer resetTrigger={timerReset} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="ion-center">
                <TextButton onClick={requestWalletAccount}>
                  <h4>
                    <u>{t('SendNewCode')}</u>
                  </h4>
                </TextButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <AlertBox state={alertActivate} />
            </IonRow>
            <IonRow class="ion-no-padding">
              <IonCol>
                <StyledInput
                  label={t('VerificationCode')}
                  type={'text'}
                  placeholder={t('EnterTheCodeSent')}
                  onIonInput={({ target: { value } }) =>
                    setActivationCode(value as string)
                  }
                  errorPrompt={StyledInputErrorPrompt.ActivationCode}
                  validate={validateActivationCode}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={t('Password')}
                  placeholder={t('EnterPassword')}
                  type="password"
                  onIonInput={({ target: { value } }) =>
                    setPassword(value as string)
                  }
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
                  errorPrompt={StyledInputErrorPrompt.ConfirmPassword}
                  validate={validateConfirmPassword}
                  submitOnEnter={activateWalletAccount}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              {ResetButton}
              <IonCol>
                <PurpleButton
                  expand="block"
                  onClick={activateWalletAccount}
                  disabled={!password || !confirmPassword || !activationCode}
                >
                  {t('Confirm')}
                </PurpleButton>
              </IonCol>
            </IonRow>
          </>
        )}
        {view === CreateWalletView.AccountCreated && (
          <>
            <IonRow>
              <IonCol>
                <h2>{t('WalletCreated')}</h2>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginBottom: '32px' }}>
              <IonCol>
                <h6>{t('SaveKey')}</h6>
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-center">
              <IonCol>
                <OtkBox
                  label={t('PublicAddress')}
                  text={newAccount?.identity}
                  withCopy={false}
                />
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-center">
              <IonCol>
                <OtkBox label={t('PrivateKey')} text={newAccount?.privateKey} />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <PurpleButton
                  expand="block"
                  onClick={() => {
                    setView(CreateWalletView.RequestAccount);
                    logout().then(() => {
                      isPlatform('mobile') && location.reload();
                    });
                  }}
                >
                  {t('Continue')}
                </PurpleButton>
              </IonCol>
            </IonRow>
          </>
        )}
      </MainGrid>
    </PublicLayout>
  );
}
