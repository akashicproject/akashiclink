import type { IActivateWalletAccountResponse } from '@helium-pay/backend';
import { ActivationRequestType, userConst } from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonRow } from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  Alert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { MainTitle } from '../../components/layout/main-title';
import { MainLayout } from '../../components/layout/mainLayout';
import { StyledInput } from '../../components/styled-input';
import { OwnersAPI } from '../../utils/api';
import {
  lastPageStorage,
  ResetPageButton,
} from '../../utils/last-page-storage';
import { storeLocalAccount } from '../../utils/local-account-storage';
import { CreatingWallet } from './creating-wallet';
import { WalletCreated } from './wallet-created';

enum CreateWalletView {
  RequestAccount = 'RequestAccount',
  ActivateAccount = 'ActivateAccount',
  AccountBeingActivated = 'AccountBeingActivated',
  AccountCreated = 'AccountCreated',
}

export const createWalletUrl = 'create-wallet';

export function CreateWallet() {
  const { i18n, t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (lastPageStorage.get() === createWalletUrl)
      setView(CreateWalletView.ActivateAccount);
  }, []);

  const [view, setView] = useState(CreateWalletView.RequestAccount);
  const [alert, setAlert] = useState(formAlertResetState);

  /** Tracking user input */
  const [email, setEmail] = useState<string>();
  const validateEmail = (value: string) => !!value.match(userConst.emailRegex);

  const [activationCode, setActivationCode] = useState<string>();
  const [password, setPassword] = useState<string>();
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const validateConfirmPassword = (value: string) => password === value;

  /** Tracking response from server after account is created */
  const [newAccount, setNewAccount] =
    useState<IActivateWalletAccountResponse>();

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
        await OwnersAPI.requestActivationCode({
          activationType: ActivationRequestType.CreateWalletAccount,
          lang: i18n.language as Language,
          payload: { email },
        });
        lastPageStorage.store(createWalletUrl);
        setView(CreateWalletView.ActivateAccount);
      } catch (e) {
        setAlert(errorAlertShell(t('GenericFailureMsg')));
      }
    } else setAlert(errorAlertShell(t('InvalidEmail')));
  }

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
      setView(CreateWalletView.AccountBeingActivated);
      localStorage.clear();

      try {
        const createAccountResponse = await OwnersAPI.activateNewAccount({
          lang: i18n.language as Language,
          password,
          confirmPassword,
          activationCode,
          // TODO: add proper social recovery
          socialRecoveryEmail: 'test@mail.com',
        });
        // Set new account details and display summary screen
        setNewAccount(createAccountResponse);
        storeLocalAccount({
          identity:
            createAccountResponse.identity || createAccountResponse.username,
          username: createAccountResponse.username,
        });
        setView(CreateWalletView.AccountCreated);
      } catch (e) {
        let message = t('GenericFailureMsg');
        if (axios.isAxiosError(e)) message = e.response?.data?.message;

        setAlert(errorAlertShell(message));
        setView(CreateWalletView.ActivateAccount);
      }
    } else setAlert(errorAlertShell(t('PasswordHelperText')));
  }

  return (
    <MainLayout>
      <MainGrid>
        <Alert state={alert} />
        <IonRow>
          <IonCol class="ion-center">
            <MainTitle>{t('CreateYourWallet')}</MainTitle>
          </IonCol>
          <IonCol class="ion-center" size="2">
            <ResetPageButton
              callback={() => {
                history.push('/');
                setView(CreateWalletView.RequestAccount);
              }}
            />
          </IonCol>
        </IonRow>
        {view === CreateWalletView.RequestAccount && (
          <>
            <IonRow>
              <IonCol>
                <StyledInput
                  label="Email"
                  type="email"
                  placeholder={t('EnterYourEmail')}
                  onIonInput={({ target: { value } }) =>
                    setEmail(value as string)
                  }
                  validate={validateEmail}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <WhiteButton
                  expand="block"
                  onClick={requestWalletAccount}
                  disabled={!email}
                >
                  {t('Send')}
                </WhiteButton>
              </IonCol>
            </IonRow>
          </>
        )}
        {view === CreateWalletView.ActivateAccount && (
          <>
            <IonRow>{t('ConfirmEmailSent', { email })}</IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={t('VerificationCode')}
                  type={'text'}
                  placeholder={t('EnterTheCodeSent')}
                  onIonInput={({ target: { value } }) =>
                    setActivationCode(value as string)
                  }
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={'Password'}
                  placeholder={t('EnterTheCodeSent')}
                  onIonInput={({ target: { value } }) =>
                    setPassword(value as string)
                  }
                  validate={validatePassword}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label={'Confirm password'}
                  placeholder={t('EnterTheCodeSent')}
                  onIonInput={({ target: { value } }) =>
                    setConfirmPassword(value as string)
                  }
                  validate={validateConfirmPassword}
                />
              </IonCol>
            </IonRow>
            <IonRow>
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
        {view === CreateWalletView.AccountBeingActivated && <CreatingWallet />}
        {view === CreateWalletView.AccountCreated && (
          <WalletCreated
            privateKey={newAccount?.privateKey}
            walletAddress={newAccount?.identity}
          />
        )}
      </MainGrid>
    </MainLayout>
  );
}
