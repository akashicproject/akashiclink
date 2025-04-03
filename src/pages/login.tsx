import './common.css';
import './hp-main.css';

import styled from '@emotion/styled';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useState } from 'react';

import { PurpleButton } from '../components/buttons';
import { Footer } from '../components/layout/footer';
import { StyledInput } from '../components/styled-input';
import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';
import { OwnersAPI } from '../utils/api';
import type { CachedAccount } from '../utils/local-storage';
import { unpackCachedAccounts } from '../utils/local-storage';

const HelpLink = styled.a({
  textDecoration: 'none',
});

export function Login() {
  const router = useIonRouter();

  const availableAccounts = unpackCachedAccounts();
  const [selectedAccount, setSelectedAccount] = useState<CachedAccount>();
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    if (availableAccounts.length) setSelectedAccount(availableAccounts[0]);
  }, []);

  async function login() {
    try {
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
                <h1>Welcome back!</h1>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="dark">
                <h3>Your most reliable wallet</h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSelect
                value={selectedAccount?.identity}
                onIonChange={({ detail: { value } }) =>
                  setSelectedAccount(value)
                }
                interface="popover"
              >
                {availableAccounts.map((account) => {
                  return (
                    <IonSelectOption
                      key={account.identity}
                      value={account}
                      class="menu-text"
                    >
                      {account.identity}
                    </IonSelectOption>
                  );
                })}
              </IonSelect>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="ion-center">
              <StyledInput
                label={'Password'}
                type={'password'}
                placeholder={'Please enter your password'}
                onIonInput={({ target: { value } }) =>
                  setPassword(value as string)
                }
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <PurpleButton onClick={login} expand="block">
                Unlock
              </PurpleButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>
                <h3>
                  <HelpLink href="www.bing.com">Forgot your password?</HelpLink>
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
