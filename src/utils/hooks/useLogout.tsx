import { Preferences } from '@capacitor/preferences';
import { mutate } from 'swr';

import { LAST_HISTORY_ENTRIES } from '../../constants';
import { urls } from '../../constants/urls';
import { historyResetStackAndRedirect } from '../../routing/history';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { axiosBase } from '../axios-helper';
import { EXTENSION_EVENT, responseToSite } from '../chrome';

export function useLogout(callLogout = true) {
  const { setCacheOtk } = useAccountStorage();

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

    // Clear the SWR cache for every key
    mutate((_key) => true, undefined, { revalidate: false });

    responseToSite({
      event: EXTENSION_EVENT.USER_LOCKED_WALLET,
    });

    // completely reset router history
    historyResetStackAndRedirect(urls.akashicPay);
  };
}
