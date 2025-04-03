import './common.css';
import './hp-main.css';

import styled from '@emotion/styled';
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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../components/buttons';
import { Footer } from '../components/layout/footer';
import { StyledInput } from '../components/styled-input';
import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';
import { OwnersAPI } from '../utils/api';
import { unpackCachedAccounts } from '../utils/local-storage';

const HelpLink = styled.a({
  textDecoration: 'none',
});

export function Login() {
  const router = useIonRouter();
  const { t } = useTranslation();

  const availableAccounts = unpackCachedAccounts();
  const [selectedIdentity, setSelectedIdentity] = useState('');
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    if (availableAccounts.length)
      setSelectedIdentity(availableAccounts[0].identity);
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
        router.push(heliumPayPath(urls.loggedFunction));
      }
    } catch {
      console.log('Failed login');
    }
  }

  return (
    <IonPage>
      <IonContent>
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
          <IonRow>
            <IonCol class="ion-center">
              <IonItem class={'select-item-account'}>
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
            <IonCol class="ion-center">
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
              <PurpleButton onClick={login} expand="block">
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
