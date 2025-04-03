import './common.css';
import './hp-main.css';

import styled from '@emotion/styled';
import type { Language } from '@helium-pay/common-i18n';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonRouter,
} from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SubmitActivationCode } from '../components/activation/submit-activation-code';
import {
  Alert,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { PurpleButton } from '../components/buttons';
import { Footer } from '../components/layout/footer';
import { StyledInput } from '../components/styled-input';
import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';
import { OwnersAPI } from '../utils/api';
import { lastPageStorage } from '../utils/last-page-storage';
import { getLocalAccounts } from '../utils/local-account-storage';

const HelpLink = styled.a({
  textDecoration: 'none',
});

enum View {
  Login,
  TwoFa,
}
export const loginUrl = 'login';

export function Login() {
  const router = useIonRouter();
  const { t, i18n } = useTranslation();

  const availableAccounts = getLocalAccounts();
  const [selectedIdentity, setSelectedIdentity] = useState('');
  const [password, setPassword] = useState<string>();
  const [view, setView] = useState(View.Login);
  const [alert, setAlert] = useState(formAlertResetState);

  useEffect(() => {
    // Select first account
    if (availableAccounts.length)
      setSelectedIdentity(availableAccounts[0].identity);
    // Move to 2fa page form last session
    if (lastPageStorage.get() === loginUrl) setView(View.TwoFa);
  }, []);

  async function login() {
    try {
      const selectedAccount = availableAccounts.find(
        (account) => account.identity === selectedIdentity
      );
      if (selectedAccount && password) {
        await OwnersAPI.login({
          username: selectedAccount.username,
          password,
        });
        setView(View.TwoFa);
        lastPageStorage.store(loginUrl);
      }
    } catch (e) {
      let message = t('GenericFailureMsg');
      if (axios.isAxiosError(e)) message = e.response?.data?.message;

      setAlert(errorAlertShell(message));
    }
  }

  async function submitTwoFa(activationCode: string) {
    try {
      if (password)
        await OwnersAPI.login2fa({
          activationCode,
          password,
          lang: i18n.language as Language,
        });
      lastPageStorage.clear();
      router.push(heliumPayPath(urls.loggedFunction));
    } catch (e) {
      let message = t('GenericFailureMsg');
      if (axios.isAxiosError(e)) message = e.response?.data?.message;
      setAlert(errorAlertShell(message));
    }
  }

  return (
    <IonPage>
      <IonContent>
        <Alert state={alert} />
        <IonGrid class="main-wrapper">
          <IonRow>
            <IonCol class="ion-center">
              <IonImg
                class="main-img"
                alt=""
                src="/shared-assets/images/main/main-img.png"
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="dark">
                <h1>{t('WelcomeBack')}</h1>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="dark">
                <h3>{t('YourMostReliableWallet')}</h3>
              </IonText>
            </IonCol>
          </IonRow>
          {view === View.Login && (
            <>
              <IonRow>
                <IonCol>
                  <IonItem class="select-item-account" lines="none">
                    <IonSelect
                      value={selectedIdentity}
                      onIonChange={({ detail: { value } }) => {
                        setSelectedIdentity(value);
                      }}
                      interface="popover"
                    >
                      {availableAccounts.map((account) => {
                        return (
                          <IonSelectOption
                            key={account.identity}
                            value={account.identity}
                            class="menu-text"
                          >
                            {account.identity}
                          </IonSelectOption>
                        );
                      })}
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <StyledInput
                    label={t('Password')}
                    type={'password'}
                    placeholder={t('PleaseEnterYourPassword')}
                    onIonInput={({ target: { value } }) =>
                      setPassword(value as string)
                    }
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <PurpleButton
                    onClick={login}
                    expand="block"
                    disabled={!password}
                  >
                    {t('Unlock')}
                  </PurpleButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonText>
                    <h3>
                      <HelpLink href="www.bing.com">
                        {t('ForgotYourPassword')}
                      </HelpLink>
                    </h3>
                  </IonText>
                </IonCol>
              </IonRow>
            </>
          )}
          {view === View.TwoFa && (
            <IonRow>
              <IonCol>
                <SubmitActivationCode
                  onClose={() => {
                    setView(View.Login);
                    lastPageStorage.clear();
                  }}
                  submitWithActivationCode={submitTwoFa}
                />
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
      <Footer />
    </IonPage>
  );
}
