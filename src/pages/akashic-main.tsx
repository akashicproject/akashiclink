import './akashic-main.scss';

import { Preferences } from '@capacitor/preferences';
import { IonCol, IonImg, IonRow, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppDispatch } from '../app/hooks';
import { PublicLayout } from '../components/layout/public-layout';
import { Spinner } from '../components/loader/spinner';
import { useLogout } from '../components/logout';
import CreateOrImportForm from '../components/public/create-or-import-form';
import { LoginForm } from '../components/public/login-form';
import { LAST_PAGE_LOCATION } from '../constants';
import { onClear as onClearCreate } from '../slices/createWalletSlice';
import { onClear as onClearImport } from '../slices/importWalletSlice';
import { onClear as onClearMigrate } from '../slices/migrateWalletSlice';
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    const redirectToLastLocation = async () => {
      // this is saved from App.tsx as last location
      const lastLocationJson = await Preferences.get({
        key: LAST_PAGE_LOCATION,
      });
      const lastLocation = JSON.parse(lastLocationJson?.value || '{}');
      if (lastLocation?.pathname) {
        if (isPlatform('ios') || isPlatform('android')) {
          dispatch(onClearCreate());
          dispatch(onClearImport());
          dispatch(onClearMigrate());
          logout();
        } else {
          history.replace(lastLocation.pathname, lastLocation.state);
        }
        // Remove the last-location as history is now reset
        await Preferences.remove({ key: LAST_PAGE_LOCATION });
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
