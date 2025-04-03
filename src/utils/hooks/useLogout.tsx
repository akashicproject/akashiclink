import { Preferences } from '@capacitor/preferences';
import { useContext } from 'react';

import { CacheOtkContext } from '../../components/providers/PreferenceProvider';
import { LAST_HISTORY_ENTRIES } from '../../constants';
import { urls } from '../../constants/urls';
import { historyResetStackAndRedirect } from '../../routing/history';
import { axiosBase } from '../axios-helper';
import { useBalancesMe } from './useBalancesMe';
import { useOwner } from './useOwner';
import { useTransfersMe } from './useTransfersMe';

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
        console.error('Account already logged out');
      }
    }

    // Clear session variables
    setCacheOtk(null);
    await Preferences.remove({
      key: LAST_HISTORY_ENTRIES,
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
