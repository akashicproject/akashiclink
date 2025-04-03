import { Preferences } from '@capacitor/preferences';
import { useContext } from 'react';

import { LAST_PAGE_LOCATION } from '../constants';
import { urls } from '../constants/urls';
import { historyResetStackAndRedirect } from '../history';
import { axiosBase } from '../utils/axios-helper';
import { useBalancesMe } from '../utils/hooks/useBalancesMe';
import { useOwner } from '../utils/hooks/useOwner';
import { useTransfersMe } from '../utils/hooks/useTransfersMe';
import { CacheOtkContext } from './PreferenceProvider';

/**
 * Hook that logs user out and clears all session settings
 */
export function useLogout(callLogout = true) {
  const { mutateOwner } = useOwner();
  const { mutateBalancesMe } = useBalancesMe();
  const { mutateTransfersMe } = useTransfersMe();
  const { setCacheOtk } = useContext(CacheOtkContext);

  return async () => {
    // callLogout will be false if getting 401 errors, prevents recursive calls
    if (callLogout) {
      try {
        await axiosBase.post(`/auth/logout`);
      } catch {
        console.log('Account already logged out');
      }
    }

    // Clear session variables
    setCacheOtk(null);
    await Preferences.remove({
      key: LAST_PAGE_LOCATION,
    });

    // Trigger refresh of login status
    await mutateOwner(
      {},
      {
        revalidate: false,
      }
    );
    await mutateBalancesMe([], {
      revalidate: false,
    });
    await mutateTransfersMe([], {
      revalidate: false,
    });

    // completely reset router history
    historyResetStackAndRedirect(urls.akashicPay);
  };
}
