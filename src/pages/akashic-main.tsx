import './akashic-main.scss';

import { Preferences } from '@capacitor/preferences';
import { IonCol, IonImg, IonRow, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { PublicLayout } from '../components/layout/public-layout';
import { Spinner } from '../components/loader/spinner';
import { useLogout } from '../components/logout';
import CreateOrImportForm from '../components/public/create-or-import-form';
import { LoginForm } from '../components/public/login-form';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';

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
  const [isLoading, setIsLoading] = useState(true);
  const logout = useLogout();

  useEffect(() => {
    const redirectToLastLocation = async () => {
      // this is saved from App.tsx as last location
      const lastLocationJson = await Preferences.get({
        key: 'lastLocation',
      });
      const lastLocation = JSON.parse(lastLocationJson?.value || '{}');
      if (lastLocation?.pathname) {
        if (isPlatform('ios') || isPlatform('android')) {
          logout();
        } else {
          history.replace(lastLocation.pathname, lastLocation.state);
        }
      }
      setIsLoading(false);
    };
    setTimeout(redirectToLastLocation, 1000);
  }, []);

  if (isLoading) return <Spinner />;

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
