import './akashic-main.css';

import { IonCol, IonImg, IonRow, isPlatform } from '@ionic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton, WhiteButton } from '../components/buttons';
import { PublicLayout } from '../components/layout/public-layout';
import { LoginForm } from '../components/public/login-form';
import { ContentText } from '../components/text/context-text';
import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tree';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { useOwner } from '../utils/hooks/useOwner';
import { lastPageStorage } from '../utils/last-page-storage';

/**
 * First page seen by user when navigating to app
 * or opening extension.
 * - Logic to automatically restore previous session view
 * - Logic to present user when import or login menues depending
 *   on whether this is first login with this device
 */
export function AkashicPayMain() {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const { localAccounts } = useAccountStorage();
  const history = useHistory();
  const loginCheck = useOwner(true);

  /** Redirect to last page user was on */
  useEffect(
    () => {
      const lastPage = lastPageStorage.get();
      if (lastPage) history.push(akashicPayPath(lastPage));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /** If user is logged in, redirect to main dashboard */
  useEffect(
    () => {
      if (!loginCheck.isLoading && !loginCheck.isError)
        history.push(akashicPayPath(urls.loggedFunction));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginCheck]
  );

  return (
    <PublicLayout>
      <IonRow>
        <IonCol class="ion-center">
          <IonImg
            class={
              // Large icon on mobile or when account has not been imported locally
              isMobile || !localAccounts.length ? 'main-img' : 'main-img-web'
            }
            alt=""
          />
        </IonCol>
      </IonRow>
      {
        // Login form only displayed if local account has been imported
        localAccounts.length ? (
          <LoginForm />
        ) : (
          <>
            <IonRow style={{ marginTop: '10px' }}>
              <IonCol class="ion-center">
                <ContentText>{t('BestWayToInvestYourMoney')}</ContentText>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '8px' }}>
              <IonCol>
                <PurpleButton
                  routerLink={akashicPayPath(urls.createWalletUrl)}
                  expand="block"
                >
                  <span>{t('CreateWallet')}</span>
                </PurpleButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <WhiteButton
                  routerLink={akashicPayPath(urls.importAccountUrl)}
                  expand="block"
                >
                  {t('ImportWallet')}
                </WhiteButton>
              </IonCol>
            </IonRow>
          </>
        )
      }
    </PublicLayout>
  );
}
