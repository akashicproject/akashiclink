import './hp-main.css';
import './common.css';

import styled from '@emotion/styled';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonPage,
  IonRow,
} from '@ionic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton, WhiteButton } from '../components/buttons';
import { Footer } from '../components/layout/footer';
import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';
import { useOwner } from '../utils/hooks/useOwner';
import { lastPageStorage } from '../utils/last-page-storage';
import { getLocalAccounts } from '../utils/local-account-storage';

const ContentText = styled.span({
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  fontFamily: 'Nunito Sans',
  color: '#290056',
});

export function HeliumPayMain() {
  const { t } = useTranslation();
  const availableAccounts = getLocalAccounts();
  const history = useHistory();
  const loginCheck = useOwner(true);

  /** Redirect to last page user was on */
  useEffect(() => {
    const lastPage = lastPageStorage.get();
    if (lastPage) history.push(heliumPayPath(lastPage));
  }, []);

  /** If user is logged in, redirect to main dashboard */
  useEffect(() => {
    if (!loginCheck.isLoading && !loginCheck.isError)
      history.push(heliumPayPath(urls.loggedFunction));
  }, [loginCheck]);

  return (
    <IonPage>
      <IonContent>
        <IonGrid class="main-wrapper">
          <IonRow style={{ marginTop: '40px' }}>
            <IonCol class="ion-center">
              <IonImg
                class="logo"
                alt={''}
                src="/shared-assets/images/main/main-icon.png"
              />
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '10px' }}>
            <IonCol class="ion-center">
              <IonImg
                class="main-img"
                alt={''}
                src="/shared-assets/images/main/main-img.png"
              />
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '40px' }}>
            <IonCol class="ion-center">
              <ContentText>Best way to invest Your Money!</ContentText>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '8px' }}>
            <IonCol>
              <PurpleButton
                routerLink={heliumPayPath(urls.createWalletUrl)}
                expand="block"
              >
                <span>{t('CreateWallet')}</span>
              </PurpleButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <PurpleButton
                routerLink={heliumPayPath(urls.importAccountUrl)}
                expand="block"
              >
                {t('ImportWallet')}
              </PurpleButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <WhiteButton
                routerLink={heliumPayPath(urls.recover)}
                expand="block"
              >
                {t('Recovery')}
              </WhiteButton>
            </IonCol>
          </IonRow>
          {!!availableAccounts.length && (
            <IonRow>
              <IonCol>
                <PurpleButton
                  routerLink={heliumPayPath(urls.loginUrl)}
                  expand="block"
                >
                  {t('Login')}
                </PurpleButton>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
      <Footer />
    </IonPage>
  );
}
