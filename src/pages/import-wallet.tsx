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
import { useLogout } from '../components/logout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../components/styled-input';
import { OwnersAPI } from '../utils/api';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { lastPageStorage, ResetPageButton } from '../utils/last-page-storage';
import { unpackRequestErrorMessage } from '../utils/unpack-request-error-message';

enum View {
  Submit,
  TwoFa,
}
export const importAccountUrl = 'import';

export function ImportWallet() {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const logout = useLogout();

  /**
   * Track user inputs
   */
  const [privateKey, setPrivateKey] = useState<string>();
  const [email, setEmail] = useState<string>();
  const emailSentAlert = {
    success: true,
    visible: true,
    message: t('ConfirmEmailSent', { email }),
  };

  const { addLocalAccount, setActiveAccount } = useAccountStorage();
  const [view, setView] = useState(View.Submit);
  const [alert, setAlert] = useState(formAlertResetState);
  const [alertPage2, setAlertPage2] = useState(emailSentAlert);
  const [timerReset, setTimerReset] = useState(0);
  const [activationCode, setActivationCode] = useState<string>();

  const validateActivationCode = (value: string) =>
    !!value.match(activationCodeRegex);

  useEffect(() => {
    const loadPage = async () => {
      const lastPage = await lastPageStorage.get();

      if (lastPage === importAccountUrl) {
        const { privateKey, email } = await lastPageStorage.getVars();
        setPrivateKey(privateKey);
        setEmail(email);
        setView(View.TwoFa);
      }
    };
    loadPage();
  }, []);

  /**
   * Uploads user credentials in a request to import an
   * account
   */
  async function requestImportAccount() {
    try {
      if (privateKey) {
        const { email } = await OwnersAPI.requestActivationCode({
          activationType: ActivationRequestType.ImportWalletAccount,
          payload: { privateKey },
          lang: i18n.language as Language,
        });
        if (!email) {
          setAlert(errorAlertShell(t('UserDoesNotExist')));
          return;
        }

        setEmail(email);
        setView(View.TwoFa);
        setTimerReset(timerReset + 1);
        setAlertPage2(emailSentAlert);
        // TODO: reword logic to avoid storing private key in plain text open format
        lastPageStorage.store(importAccountUrl, {
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
          privateKey,
        });
        await lastPageStorage.clear();

        // Add accounts, and redirect to login page
        const importedAccount = {
          identity: identity || username,
          username,
        };
        addLocalAccount(importedAccount);
        setActiveAccount(importedAccount);
        setTimeout(() => {
          logout().then(() => {
            setView(View.Submit);
            isPlatform('mobile') && location.reload();
          });
        }, 500);
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
          history.push('/');
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
                  setActivationCode(undefined);
                  await lastPageStorage.clear();
                  setView(View.Submit);
                  history.push('/');
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
