import { mutate } from 'swr';

import { LAST_HISTORY_ENTRIES } from '../../constants';
import { urls } from '../../constants/urls';
import { historyResetStackAndRedirect } from '../../routing/history';
import { sendInternalLogout } from '../chrome';
import { useAccountStorage } from './useLocalAccounts';

export function useLogout() {
  const { setCacheOtk } = useAccountStorage();

  return async (options?: {
    isManualLogout?: boolean;
    preserveCurrentRequest?: boolean;
  }) => {
    // Clear session variables
    setCacheOtk(null);
    typeof window !== 'undefined' &&
      localStorage.removeItem(`CapacitorStorage.${LAST_HISTORY_ENTRIES}`);

    // Clear the SWR cache for every key
    await mutate((_key) => true, undefined, { revalidate: false });

    // Manual logout / account-switch changes the wallet identity, so revoke
    // origin grants. An auto-lock or dApp-initiated lock keeps the same
    // identity — preserve grants so the user isn't re-prompted for permission
    // when they unlock and reconnect.
    const preserveRequestId =
      options?.preserveCurrentRequest && typeof window !== 'undefined'
        ? Number(new URL(window.location.href).searchParams.get('id')) ||
          undefined
        : undefined;

    await sendInternalLogout({
      clearPermissions: !!options?.isManualLogout,
      preserveRequestId,
    });

    // completely reset router history
    historyResetStackAndRedirect(urls.akashicPay, {
      isManualLogout: !!options?.isManualLogout,
    });
  };
}
