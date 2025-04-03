import './akashic-main.scss';

import { Preferences } from '@capacitor/preferences';
import { IonCol, IonImg, IonRow, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppDispatch } from '../app/hooks';
import { PublicLayout } from '../components/layout/public-layout';
import { Spinner } from '../components/loader/spinner';
import CreateOrImportForm from '../components/public/create-or-import-form';
import { LoginForm } from '../components/public/login-form';
import {
  createWalletUrls,
  importWalletUrls,
  migrateWalletUrls,
} from '../constants/urls';
import { onClear as onCreateWalletClear } from '../slices/createWalletSlice';
import { onClear as onImportWalletClear } from '../slices/importWalletSlice';
import { onClear as onMigrateWalletClear } from '../slices/migrateWalletSlice';
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    const redirectToLastLocation = async () => {
      // this is saved from App.tsx as last location
      const lastLocationJson = await Preferences.get({
        key: 'lastLocation',
      });
      const lastLocation = JSON.parse(lastLocationJson?.value || '{}');
      if (lastLocation?.pathname) {
        if (shouldClearLocalStorage(lastLocation.pathname)) {
          dispatch(onCreateWalletClear());
          dispatch(onImportWalletClear());
          dispatch(onMigrateWalletClear());
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

const shouldClearLocalStorage = (pathname: string) => {
  if (isPlatform('ios') || isPlatform('android')) {
    const pathnameParts = pathname.split('/');
    const lastPartOfPathname = pathnameParts[pathnameParts.length - 1];
    if (
      (
        [
          ...createWalletUrls,
          ...importWalletUrls,
          ...migrateWalletUrls,
        ] as string[]
      ).includes(lastPartOfPathname)
    ) {
      return true;
    }
  }
  return false;
};
