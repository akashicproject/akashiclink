import { IonImg } from '@ionic/react';
import { useCallback, useEffect } from 'react';

import { PopupLayout } from '../components/page-layout/popup-layout';
import { LoginForm } from '../components/wallet-setup/login-form';
import { responseToSite } from '../utils/chrome';

export function PopupUnlockWallet() {
  const onPopupClosed = useCallback(() => {
    responseToSite({
      event: 'POPUP_CLOSED',
      reason: 'USER_CLOSED',
      method: 'UNLOCK_WALLET',
      isExtensionPopupClosed: true,
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
