import './hp-main.css';

import styled from '@emotion/styled';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonPage,
  IonRow,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../components/buttons';
import { Footer } from '../components/layout/footer';
import { MainTitle } from '../components/layout/main-title';
import { urls } from '../constants/urls';
import { heliumPayPath } from '../routing/navigation-tree';

const FooterText = styled.a({
  fontFamily: 'Nunito Sans',
  color: '#7444B6',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: '700',
});

const ContentText = styled.span({
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  fontFamily: 'Nunito Sans',
  color: '#290056',
});

export function Welcome() {
  const { t } = useTranslation();
  return (
    <IonPage>
      <IonContent style={{ background: '#F3F5F6' }}>
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
          <IonRow>
            <IonCol class="ion-center">
              <MainTitle>{t('WelcomeBack')}</MainTitle>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '-5px' }}>
            <IonCol class="ion-center">
              <ContentText>{t('YourMostReliableWallet')}</ContentText>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '20px' }}>
            <IonCol>
              <IonItem fill="outline">
                {/** TODO: t('Locale') is not correctly recognised as string - maybe be fixed in the translations refactor */}
                <IonInput placeholder={t('Password') as string}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '8px' }}>
            <IonCol>
              <PurpleButton
                routerLink={heliumPayPath(urls.beforeCreateWallet)}
                expand="block"
              >
                <span>{t('Unlock')}</span>
              </PurpleButton>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '18px' }}>
            <IonCol class="ion-center">
              <FooterText href={heliumPayPath(urls.recovery)}>
                {t('ForgotYourPassword')}
              </FooterText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <Footer />
    </IonPage>
  );
}
