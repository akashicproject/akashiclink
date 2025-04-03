import { Preferences } from '@capacitor/preferences';

import { LAST_HISTORY_ENTRIES } from '../../constants';
import { urls } from '../../constants/urls';
import { useAppDispatch } from '../../redux/app/hooks';
import { setCacheOtk } from '../../redux/slices/accountSlice';
import { historyResetStackAndRedirect } from '../../routing/history';
import { axiosBase } from '../axios-helper';
import { useAccountMe } from './useAccountMe';
import { useMyTransfers } from './useMyTransfers';
import { useOwner } from './useOwner';

export function useLogout(callLogout = true) {
  const { mutateOwner } = useOwner();
  const { mutate: mutateAccountMe } = useAccountMe();
  const { mutateMyTransfers } = useMyTransfers();
  const dispatch = useAppDispatch();

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
    dispatch(setCacheOtk(null));
    await Preferences.remove({
      key: LAST_HISTORY_ENTRIES,
    });

    // Trigger refresh of login status
    await mutateOwner(undefined, {
      revalidate: false,
    });
    await mutateAccountMe(undefined, {
      revalidate: false,
    });
    await mutateMyTransfers(undefined, {
      revalidate: false,
    });

    // completely reset router history
    historyResetStackAndRedirect(urls.akashicPay);
  };
}
