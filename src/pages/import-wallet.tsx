import {
  activationCodeRegex,
  ActivationRequestType,
} from '@helium-pay/backend';
import type { Language } from '@helium-pay/common-i18n';
import { IonCol, IonRow, isPlatform } from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { ActivationTimer } from '../components/activation/activation-timer';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { PurpleButton, TextButton, WhiteButton } from '../components/buttons';
import { PublicLayout } from '../components/layout/public-layout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../components/styled-input';
import { urls } from '../constants/urls';
import type { LocationState } from '../history';
import { akashicPayPath } from '../routing/navigation-tree';
import { OwnersAPI } from '../utils/api';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../utils/last-page-storage';
import { signImportAuth } from '../utils/otk-generation';
import { unpackRequestErrorMessage } from '../utils/unpack-request-error-message';

export enum View {
  Submit,
  SubmitSecretPhrase,
  TwoFa,
}
export const importAccountUrl = 'import';

export function ImportWallet() {
  const history = useHistory<LocationState>();
  const { t, i18n } = useTranslation();

  const stateView = history.location?.state?.importView ?? View.Submit;

  /**
   * Track user inputs
   */
  const [view, setView] = useState(stateView);
  const [initialView, setInitialView] = useState(stateView);
  const [privateKey, setPrivateKey] = useState<string>();
  const [email, setEmail] = useState<string>();
  const emailSentAlert = {
    success: true,
    visible: true,
    message: t('ConfirmEmailSent', { email }),
  };

  const { addLocalAccount, setActiveAccount } = useAccountStorage();

  const [alert, setAlert] = useState(formAlertResetState);
  const [alertPage2, setAlertPage2] = useState(emailSentAlert);
  const [timerReset, setTimerReset] = useState(0);
  const [activationCode, setActivationCode] = useState<string>();
  const [passPhrase, setPassPhrase] = useState<string>();
  const validateActivationCode = (value: string) =>
    !!value.match(activationCodeRegex);

  useEffect(() => {
    cacheCurrentPage(
      importAccountUrl,
      NavigationPriority.IMMEDIATE,
      async () => {
        const { privateKey, email, view, initialView, passPhrase } =
          await lastPageStorage.getVars();
        console.log(passPhrase);
        setPassPhrase(passPhrase || '');
        setView(view ?? stateView);
        setInitialView(initialView ?? stateView);
        setEmail(email || '');
        setPrivateKey(privateKey || '');
      }
    );
    setView(stateView);
  }, [stateView]);
  /**
   * Uploads user credentials in a request to import an
   * account
   */
  async function requestImportAccount() {
    try {
      if (privateKey && email) {
        const response = await OwnersAPI.requestActivationCode({
          activationType: ActivationRequestType.ImportWalletAccount,
          payload: { email },
          lang: i18n.language as Language,
        });
        if (!response.email) {
          setAlert(errorAlertShell(t('UserDoesNotExist')));
          return;
        }
        setView(View.TwoFa);
        setTimerReset(timerReset + 1);
        setAlertPage2(emailSentAlert);
        // TODO: reword logic to avoid storing private key in plain text open format
        lastPageStorage.store(importAccountUrl, NavigationPriority.IMMEDIATE, {
          view: View.TwoFa,
          initialView: initialView || View.Submit,
          privateKey,
          email,
        });
      }
    } catch (e) {
      let message = t('GenericFailureMsg');
      if (axios.isAxiosError(e)) message = e.response?.data?.message || message;
      setAlert(errorAlertShell(message));
    }
  }

  async function submit2fa() {
    try {
      if (privateKey && email && activationCode) {
        const { username, identity } = await OwnersAPI.importAccount({
          activationCode,
          email,
          signedAuth: signImportAuth(privateKey, email),
        });
        await lastPageStorage.clear();

        // Add accounts, and redirect to login page
        const importedAccount = {
          identity: identity || username,
          username,
        };
        addLocalAccount(importedAccount);
        setActiveAccount(importedAccount);

        // Clear all states when finished
        setPrivateKey(undefined);
        setActivationCode(undefined);
        setPassPhrase(undefined);
        setEmail(undefined);
        setTimerReset(timerReset + 1);
        setView(View.Submit);
        setInitialView(View.Submit);
        history.push(akashicPayPath(urls.importSuccess));
        localStorage.setItem('spinner', 'true');
      }
    } catch (error) {
      setAlertPage2(errorAlertShell(t(unpackRequestErrorMessage(error))));
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
          setView(View.Submit);
          history.push(akashicPayPath(urls.akashicPay));
          isPlatform('mobile') && location.reload();
        }}
      />
    </IonCol>
  );

  return (
    <PublicLayout className="vertical-center">
      <IonRow>
        <IonCol>
          <h2>{t('ImportWallet')}</h2>
        </IonCol>
      </IonRow>
      {view === View.SubmitSecretPhrase && (
        <>
          <IonRow>
            <IonCol>
              <StyledInput
                label={t('Email')}
                type={'text'}
                placeholder={t('EnterYourEmail')}
                onIonInput={async ({ target: { value } }) => {
                  setEmail(value as string);
                  await lastPageStorage.store(
                    urls.importAccountUrl,
                    NavigationPriority.IMMEDIATE,
                    {
                      view: initialView,
                      initialView: initialView,
                      email: value,
                    }
                  );
                  setAlert(formAlertResetState);
                }}
                value={email}
                submitOnEnter={requestImportAccount}
              />
            </IonCol>
          </IonRow>
          <IonRow style={{ justifyContent: 'space-between' }}>
            <IonCol size="6">
              <PurpleButton
                disabled={!email}
                onClick={requestImportAccount}
                expand="block"
              >
                {t('Confirm')}
              </PurpleButton>
            </IonCol>
            <IonCol size="6">
              <WhiteButton
                onClick={async () => {
                  history.push(akashicPayPath(urls.secretPhraseImport));
                  await lastPageStorage.store(
                    urls.secretPhraseImport,
                    NavigationPriority.IMMEDIATE,
                    {
                      passPhrase: passPhrase,
                    }
                  );
                }}
                style={{ width: '100%' }}
              >
                {t('GoBack')}
              </WhiteButton>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '24px' }}>
            <AlertBox state={alert} />
          </IonRow>
        </>
      )}
      {view === View.Submit && (
        <>
          <IonRow>
            <IonCol>
              <h6>{t('EnterKeyPair')}</h6>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '40px' }}>
            <IonCol>
              <StyledInput
                label={t('KeyPair')}
                type={'text'}
                value={privateKey}
                placeholder={t('EnterKeyPair')}
                onIonInput={({ target: { value } }) => {
                  setPrivateKey(value as string);
                  setAlert(formAlertResetState);
                }}
                submitOnEnter={requestImportAccount}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <StyledInput
                label={t('Email')}
                type={'text'}
                placeholder={t('EnterYourEmail')}
                onIonInput={({ target: { value } }) => {
                  setEmail(value as string);
                  setAlert(formAlertResetState);
                }}
                value={email}
                submitOnEnter={requestImportAccount}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            {ResetButton}
            <IonCol>
              <PurpleButton
                disabled={!privateKey}
                onClick={requestImportAccount}
                expand="block"
              >
                {t('SendCode')}
              </PurpleButton>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '24px' }}>
            <AlertBox state={alert} />
          </IonRow>
        </>
      )}
      {view === View.TwoFa && (
        <>
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
              <TextButton disabled={!privateKey} onClick={requestImportAccount}>
                <h4>
                  <u>{t('SendNewCode')}</u>
                </h4>
              </TextButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <AlertBox state={alertPage2} />
          </IonRow>
          <IonRow>
            <IonCol>
              <StyledInput
                label={t('ActivationCode')}
                placeholder={t('PleaseEnterCode')}
                value={activationCode}
                onIonInput={({ target: { value } }) => {
                  setActivationCode(value as string);
                }}
                errorPrompt={StyledInputErrorPrompt.ActivationCode}
                validate={validateActivationCode}
                submitOnEnter={submit2fa}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <WhiteButton
                expand="block"
                onClick={async () => {
                  if (initialView) {
                    setView(initialView);
                  } else {
                    setActivationCode(undefined);
                    await lastPageStorage.clear();
                    setView(View.Submit);
                    history.goBack();
                  }
                }}
              >
                {t('Cancel')}
              </WhiteButton>
            </IonCol>
            <IonCol>
              <PurpleButton
                expand="block"
                disabled={!activationCode}
                onClick={submit2fa}
              >
                {t('Confirm')}
              </PurpleButton>
            </IonCol>
          </IonRow>
        </>
      )}
    </PublicLayout>
  );
}
