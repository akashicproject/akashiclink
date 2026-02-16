import { useEffect } from 'react';

import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { closePopup, responseToSite } from '../utils/chrome';
import { useLogout } from '../utils/hooks/useLogout';

// Empty page to trigger logout action upon webpage request
export const WalletLock = () => {
  const logout = useLogout();

  useEffect(() => {
    const url = new URL(window.location.href);
    const idParam = url.searchParams.get('id');
    const lockAndClose = async () => {
      await responseToSite(
        BRIDGE_MESSAGE.APPROVAL_DECISION,
        Number(idParam),
        true
      );
      await logout();
      await closePopup();
    };

    lockAndClose();
  }, []);

  return null;
};
