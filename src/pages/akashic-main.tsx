import './akashic-main.scss';

import { IonCol, IonImg, IonRow, isPlatform } from '@ionic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton, WhiteButton } from '../components/buttons';
import { PublicLayout } from '../components/layout/public-layout';
import { LoginForm } from '../components/public/login-form';
import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tree';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { useOwner } from '../utils/hooks/useOwner';
import {
  lastPageStorage,
  NavigationPriority,
} from '../utils/last-page-storage';

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

  /**
   * Check if there is a forced page to redirect to
   */
  useEffect(() => {
    const loadPage = async () => {
      const lastPage = await lastPageStorage.get();
      if (
        lastPage &&
        lastPage.navigationPriority === NavigationPriority.IMMEDIATE
      )
        history.push(akashicPayPath(lastPage.lastPageUrl));
    };
    loadPage();
  }, []);

  /**
   * For all other redirects, await until user has passed authentication
   */
  useEffect(
    () => {
      if (!loginCheck.isLoading && loginCheck.authenticated)
        lastPageStorage.get().then((lastPage) => {
          lastPage
            ? history.push(akashicPayPath(lastPage.lastPageUrl))
            : history.push(akashicPayPath(urls.loggedFunction));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginCheck.isLoading]
  );

  return (
    <PublicLayout>
      <IonRow>
        <IonCol class="ion-center">
          <IonImg
            className={
              isMobile || !localAccounts.length
                ? 'welcome-img'
                : 'welcome-img-small'
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
            <IonRow style={{ marginTop: '16px' }}>
              <IonCol class="ion-center">
                <h3>{t('BestWayToInvestYourMoney')}</h3>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
              <IonCol>
                <PurpleButton
                  routerLink={akashicPayPath(urls.createWalletUrl)}
                  expand="block"
                >
                  {t('CreateYourWallet')}
                </PurpleButton>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
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
