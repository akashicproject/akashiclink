import './common.css';
import './hp-main.css';

import styled from '@emotion/styled';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import { getLocalAccounts } from '../utils/local-account-storage';
import { unpackRequestErrorMessage } from '../utils/unpack-request-error-message';

const HelpLink = styled.a({
  textDecoration: 'none',
});

export const loginUrl = 'login';

export function Login() {
  const router = useIonRouter();
  const { t } = useTranslation();

  const availableAccounts = getLocalAccounts();
  const [selectedIdentity, setSelectedIdentity] = useState('');
  const [password, setPassword] = useState<string>();
  const [alert, setAlert] = useState(formAlertResetState);

  useEffect(() => {
    // Select first account
    if (availableAccounts.length)
      setSelectedIdentity(availableAccounts[0].identity);
  }, []);

  /**
   * Perform login - if 201 is returned, attempt to fetch some data:
   * - 401 means that 2fa has not been passed yet
   * - 200 means that 2fa is not required by backend
   */
  const login = async () => {
    try {
      const selectedAccount = availableAccounts.find(
        (account) => account.identity === selectedIdentity
      );
      if (selectedAccount && password) {
        await OwnersAPI.login({
          username: selectedAccount.username,
          password,
        });
        router.push(heliumPayPath(urls.loggedFunction));
      }
    } catch (error) {
      setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
    }
  };

  return (
    <IonPage>
      <IonContent>
        <Alert state={alert} />
        <IonGrid class="main-wrapper">
          <IonRow>
            <IonCol>
              <IonText color="dark">
                <h1>{t('WelcomeBack')}</h1>
              </IonText>
            </IonCol>
          </IonRow>
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
              <PurpleButton onClick={login} expand="block" disabled={!password}>
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
        </IonGrid>
      </IonContent>
      <Footer />
    </IonPage>
  );
}
