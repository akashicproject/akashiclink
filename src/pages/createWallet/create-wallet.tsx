import type { IActivateWalletAccountResponse } from '@helium-pay/backend';
import {
  activationCodeRegex,
  ActivationRequestType,
  userConst,
} from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonLabel, IonRow, isPlatform } from '@ionic/react';
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
import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { useLogout } from '../../components/logout';
import { OtkBox } from '../../components/otk-box/otk-box';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { ContentText } from '../../components/text/context-text';
import { OwnersAPI } from '../../utils/api';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import {
  lastPageStorage,
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

  /**
   * Resume a creating wallet session
   */
  useEffect(() => {
    if (lastPageStorage.get() === createWalletUrl) {
      const { email } = lastPageStorage.getVars();
      setEmail(email);
      setView(CreateWalletView.ActivateAccount);
    }
  }, []);

  const [view, setView] = useState(CreateWalletView.RequestAccount);
  const [alertRequest, setAlertRequest] = useState(formAlertResetState);
  const [alertActivate, setAlertActivate] = useState(formAlertResetState);
  const { addLocalAccount, setActiveAccount } = useAccountStorage();

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

  /**
   * Countdown showing validity of activation code
   */
  const [timer, setTimer] = useState(false);

  /**
   * Activation request is sent -> email with activation code is sent to user
   * Page is saved - this way user can resume activation after switching
   * to check email which minimises the extension
   */
  const RequestWalletAccountButton = (
    <IonCol>
      <PurpleButton
        expand="block"
        onClick={async () => {
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
              lastPageStorage.store(createWalletUrl, { email });
              setView(CreateWalletView.ActivateAccount);

              // Launch countdown while code is valid
              setTimer(true);
            } catch (e) {
              setAlertRequest(errorAlertShell(t('GenericFailureMsg')));
            }
          } else setAlertRequest(errorAlertShell(t('InvalidEmail')));
        }}
        disabled={!email}
      >
        {t('SendCode')}
      </PurpleButton>
    </IonCol>
  );

  /**
   * Code in email is submitted to backend along with password to use
   * Wallets are created and user is moved to "Activation" screen
   * TODO: add helper text re password requirements and passwords not matching
   */
  async function activateWalletAccount() {
    if (!(activationCode && password && confirmPassword)) return;

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
          // TODO: add proper social recovery
          socialRecoveryEmail: 'test@mail.com',
        });

        // Complete the create-wallet flow
        lastPageStorage.clear();

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
      } catch (e) {
        let message = t('GenericFailureMsg');
        if (axios.isAxiosError(e))
          message = e.response?.data?.message || message;
        setAlertActivate(errorAlertShell(message));
      } finally {
        setCreatingAccount(false);
        setTimer(false);
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
    <MainLayout>
      <MainGrid>
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>{t('CreateYourWallet')}</MainTitle>
          </IonCol>
        </IonRow>
        {view === CreateWalletView.RequestAccount && (
          <>
            <IonRow>
              <IonCol class="ion-center">
                <ContentText>{t('EnterEmailToCreateAccount')}</ContentText>
              </IonCol>
            </IonRow>
          </>
        )}
        {(view === CreateWalletView.RequestAccount ||
          view === CreateWalletView.ActivateAccount) && (
          <>
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
                />
              </IonCol>
            </IonRow>
          </>
        )}
        {creatingAccount && <CreatingWallet />}
        {view === CreateWalletView.RequestAccount && (
          <>
            <IonRow>
              {ResetButton}
              {RequestWalletAccountButton}
            </IonRow>
            <IonRow>
              <AlertBox state={alertRequest} />
            </IonRow>
          </>
        )}
        {view === CreateWalletView.ActivateAccount && (
          <>
            <IonRow>{t('ConfirmEmailSent', { email: '' })}</IonRow>
            <IonRow>
              <IonCol class="ion-center">
                {timer ? (
                  <ActivationTimer onComplete={() => setTimer(false)} />
                ) : (
                  RequestWalletAccountButton
                )}
              </IonCol>
            </IonRow>
            <IonRow>
              <AlertBox state={alertRequest} />
            </IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={t('VerificationCode')}
                  type={'text'}
                  placeholder={t('EnterTheCodeSent')}
                  onIonInput={({ target: { value } }) => {
                    setActivationCode(value as string);
                    setAlertActivate(formAlertResetState);
                  }}
                  errorPrompt={StyledInputErrorPrompt.ActivationCode}
                  validate={validateActivationCode}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={'Password'}
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
                  label={'Confirm password'}
                  type="password"
                  placeholder={t('ConfirmPassword')}
                  onIonInput={({ target: { value } }) =>
                    setConfirmPassword(value as string)
                  }
                  errorPrompt={StyledInputErrorPrompt.ConfirmPassword}
                  validate={validateConfirmPassword}
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
            <IonRow>
              <AlertBox state={alertActivate} />
            </IonRow>
          </>
        )}
        {view === CreateWalletView.AccountCreated && (
          <>
            <IonRow>
              <IonCol class="ion-center">
                <MainTitle>{t('WalletCreated')}</MainTitle>
              </IonCol>
            </IonRow>
            <IonRow>{t('SaveKey')}</IonRow>
            <IonRow class="ion-justify-content-center">
              <IonCol>
                <IonLabel position="stacked">{t('PublicAddress')}</IonLabel>
                <OtkBox text={newAccount?.identity} withCopy={false} />
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-center">
              <IonCol>
                <IonLabel position="stacked">{t('PrivateKey')}</IonLabel>
                <OtkBox text={newAccount?.privateKey} />
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
    </MainLayout>
  );
}
