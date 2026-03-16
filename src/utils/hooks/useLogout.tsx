import { mutate } from 'swr';

import { LAST_HISTORY_ENTRIES } from '../../constants';
import { urls } from '../../constants/urls';
import { historyResetStackAndRedirect } from '../../routing/history';
import { BRIDGE_MESSAGE } from '../../types/bridge-types';
import { responseToSite } from '../chrome';
import { useAccountStorage } from './useLocalAccounts';

export function useLogout() {
  const { setCacheOtk } = useAccountStorage();

  return async (options?: { isManualLogout?: boolean }) => {
    // Clear session variables
    setCacheOtk(null);
    typeof window !== 'undefined' &&
      localStorage.removeItem(`CapacitorStorage.${LAST_HISTORY_ENTRIES}`);

    // Clear the SWR cache for every key
    await mutate((_key) => true, undefined, { revalidate: false });

    await responseToSite(BRIDGE_MESSAGE.INTERNAL_LOGOUT);

    // completely reset router history
    historyResetStackAndRedirect(urls.akashicPay, {
      isManualLogout: !!options?.isManualLogout,
    });
  };
}
