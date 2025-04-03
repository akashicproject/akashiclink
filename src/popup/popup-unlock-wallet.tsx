import { IonImg } from '@ionic/react';
import { useCallback, useEffect } from 'react';

import { PopupLayout } from '../components/page-layout/popup-layout';
import { LoginForm } from '../components/wallet-setup/login-form';
import {
  EXTENSION_EVENT,
  responseToSite,
  WALLET_METHOD,
} from '../utils/chrome';

export function PopupUnlockWallet() {
  const onPopupClosed = useCallback(() => {
    responseToSite({
      method: WALLET_METHOD.UNLOCK_WALLET,
      event: EXTENSION_EVENT.USER_CLOSED_POPUP,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', onPopupClosed);
    return () => {
      window.removeEventListener('beforeunload', onPopupClosed);
    };
  }, []);

  return (
    <PopupLayout showIdentity={false}>
      <IonImg className={'welcome-img ion-margin-auto'} alt="welcome" />
      <LoginForm />
    </PopupLayout>
  );
}
