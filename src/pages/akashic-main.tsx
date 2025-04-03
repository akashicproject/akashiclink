import './akashic-main.scss';

import { IonCol, IonImg, IonRow, isPlatform } from '@ionic/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { PublicLayout } from '../components/layout/public-layout';
import CreateOrImportForm from '../components/public/create-or-import-form';
import { LoginForm } from '../components/public/login-form';
import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tabs';
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
  const isMobile = isPlatform('mobile');
  const { localAccounts } = useAccountStorage();
  const history = useHistory();
  const loginCheck = useOwner(true);
  /**
   * Check if there is a forced page to redirect to
   * Sometimes a random loggedFunction with immediate priority sneaks in there (at least when moving between app versions)
   *  which causes unwanted push here, so we check for that.
   * TODO: Figure out root cause and address
   */
  useEffect(() => {
    const loadPage = async () => {
      const lastPage = await lastPageStorage.get();
      if (
        lastPage &&
        lastPage.lastPageUrl !== urls.loggedFunction &&
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
        <IonCol className="ion-center">
          <IonImg
            className={
              isMobile || !localAccounts.length
                ? 'welcome-img'
                : 'welcome-img-small'
            }
            alt="welcome"
          />
        </IonCol>
      </IonRow>
      {localAccounts.length ? <LoginForm /> : <CreateOrImportForm />}
    </PublicLayout>
  );
}
