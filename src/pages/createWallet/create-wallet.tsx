import { datadogRum } from '@datadog/browser-rum';
import {
  activationCodeRegex,
  ActivationRequestType,
  userConst,
} from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
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
import { Spinner } from '../../components/loader/spinner';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { historyGoBack } from '../../routing/history-stack';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { OwnersAPI } from '../../utils/api';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useOwner } from '../../utils/hooks/useOwner';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../../utils/last-page-storage';
import { generateOTK } from '../../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

enum CreateWalletView {
  RequestAccount = 'RequestAccount',
  ActivateAccount = 'ActivateAccount',
  AccountCreated = 'AccountCreated',
}

export function CreateWallet() {
  const { i18n, t } = useTranslation();
  const history = useHistory();
  const loginCheck = useOwner(true);

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

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const emailSentAlert = {
    success: true,
    visible: true,
    message: t('ConfirmEmailSent', { email }),
  };
  const [alertRequest, setAlertRequest] = useState(formAlertResetState);
  const [alertActivate, setAlertActivate] = useState(emailSentAlert);
  const { addLocalAccount, setActiveAccount, addLocalOtk } =
    useAccountStorage();

  /**
   * Countdown showing validity of activation code
   */
  const [timerReset, setTimerReset] = useState(0);

  useEffect(() => {
    cacheCurrentPage(
      urls.createWalletUrl,
      NavigationPriority.IMMEDIATE,
      async () => {
        const data = await lastPageStorage.getVars();
        if (data.email) {
          setEmail(data.email);
          setView(CreateWalletView.ActivateAccount);
        }
        if (data.view === CreateWalletView.ActivateAccount && data.email) {
          setEmail(data.email);
          setPassword(data.password);
          setConfirmPassword(data.confirmPassword);
          setTimerReset(data.timer);
          setView(data.view);
          setActivationCode(data.activationCode);
        }
        if (data.identity && data.privateKey) {
          // Set new account details and display summary screen
          const newAccount = {
            identity: data.identity || data.username,
            username: data.username,
          };
          addLocalAccount(newAccount);
          setActiveAccount(newAccount);
          setView(CreateWalletView.AccountCreated);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (password || confirmPassword || activationCode) {
      lastPageStorage.store(
        urls.createWalletUrl,
        NavigationPriority.IMMEDIATE,
        {
          password: password,
          confirmPassword: confirmPassword,
          activationCode: activationCode,
          view: CreateWalletView.ActivateAccount,
          timer: timerReset,
          email: email,
        }
      );
    }
  }, [password, confirmPassword, activationCode]);
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
        lastPageStorage.store(
          urls.createWalletUrl,
          NavigationPriority.IMMEDIATE,
          {
            email,
          }
        );
        setView(CreateWalletView.ActivateAccount);

        // Launch countdown while code is valid
        setTimerReset(timerReset + 1);
        setAlertRequest(formAlertResetState);
        setAlertActivate(emailSentAlert);
      } catch (e) {
        datadogRum.addError(e);
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
      try {
        setCreatingAccount(true);
        const otk = await generateOTK();
        const createAccountResponse = await OwnersAPI.activateNewAccount({
          lang: i18n.language as Language,
          password,
          confirmPassword,
          activationCode,
          email,
          clientSidePubKey: otk.key.pub,
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
        addLocalOtk({ ...otk, identity: createAccountResponse.identity });
        addLocalAccount(newAccount);
        setAlertRequest(formAlertResetState);
        setAlertActivate(formAlertResetState);
        await lastPageStorage.clear();
        lastPageStorage.store(urls.secret, NavigationPriority.IMMEDIATE, {
          passPhrase: otk.phrase,
        });
        history.push({
          pathname: akashicPayPath(urls.secret),
          state: newAccount,
        });
      } catch (e) {
        datadogRum.addError(e);
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
   * Redirect user to previous page, and reset page state
   */
  const CancelButton = (
    <IonCol>
      <ResetPageButton
        expand="block"
        callback={() => {
          historyGoBack(
            history,
            !loginCheck.isLoading && !loginCheck.authenticated
          );
          setView(CreateWalletView.RequestAccount);
        }}
      />
    </IonCol>
  );
  return (
    <PublicLayout className="vertical-center">
      {creatingAccount && (
        <Spinner
          header={'CreatingYourWallet'}
          warning={'DoNotClose'}
          animationDuration="50s"
        />
      )}
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
                value={email}
              />
            </IonCol>
          </IonRow>
        )}
        {view === CreateWalletView.RequestAccount && (
          <>
            <IonRow>
              {CancelButton}
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
                  <h4 style={{ color: 'var(--ion-text-header)' }}>
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
                  value={activationCode}
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
                  value={password}
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
                  submitOnEnter={activateWalletAccount}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              {CancelButton}
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
      </MainGrid>
    </PublicLayout>
  );
}
