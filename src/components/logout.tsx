import { useHistory } from 'react-router';

import { axiosOwnerBase } from '../utils/axios-helper';
import { useOwner } from '../utils/hooks/useOwner';
import { lastPageStorage } from '../utils/last-page-storage';

/**
 * Hook that logs user out and clears all session settings
 */
export function useLogout(callLogout = true) {
  const history = useHistory();
  const { mutate } = useOwner();

  return async () => {
    // callLogout will be false if getting 401 errors, prevents recursive calls
    if (callLogout) {
      try {
        await axiosOwnerBase.post(`/auth/logout`);
      } catch {
        console.log('Account already logged out');
      }
    }

    // Trigger refresh of login status
    await mutate();

    // Clear session variables
    lastPageStorage.clear();

    console.log('going to login');
    // Redirect to landing page
    history.push('/');
  };
}
