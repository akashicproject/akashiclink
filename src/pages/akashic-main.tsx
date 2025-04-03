import './akashic-main.scss';

import { Preferences } from '@capacitor/preferences';
import { IonImg, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Spinner } from '../components/common/loader/spinner';
import { PublicLayout } from '../components/page-layout/public-layout';
import { CreateOrImportForm } from '../components/wallet-setup/create-or-import-form';
import { LoginForm } from '../components/wallet-setup/login-form';
import { LAST_PAGE_LOCATION } from '../constants';
import { useAppDispatch } from '../redux/app/hooks';
import { onClear as onClearCreate } from '../redux/slices/createWalletSlice';
import { onClear as onClearImport } from '../redux/slices/importWalletSlice';
import { onClear as onClearMigrate } from '../redux/slices/migrateWalletSlice';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { useLogout } from '../utils/hooks/useLogout';

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
          await logout();
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
      <IonImg
        className={`
          ion-margin-auto 
          ${
            isMobile || !localAccounts.length
              ? 'welcome-img'
              : 'welcome-img-small'
          }
        `}
        alt="welcome"
      />
      {localAccounts.length ? <LoginForm /> : <CreateOrImportForm />}
    </PublicLayout>
  );
}
