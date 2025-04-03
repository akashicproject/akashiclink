import { useEffect } from 'react';

import { closeAllPopup } from '../utils/chrome';
import { useLogout } from '../utils/hooks/useLogout';

// Empty page to trigger logout action upon webpage request
export const WalletLock = () => {
  const logout = useLogout();

  useEffect(() => {
    const lockAndClose = async () => {
      await logout();
      await closeAllPopup();
    };

    lockAndClose();
  }, []);

  return null;
};
