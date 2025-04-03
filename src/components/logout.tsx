import { useHistory } from 'react-router';

import { axiosOwnerBase } from '../utils/axios-helper';
import { useOwner } from '../utils/hooks/useOwner';
import { lastPageStorage } from '../utils/last-page-storage';

/**
 * Hook that logs user out and clears all session settings
 */
export function useLogout() {
  const history = useHistory();
  const { mutate } = useOwner();

  return async () => {
    try {
      await axiosOwnerBase.post(`/auth/logout`);
    } catch {
      console.log('Account already logged out');
    } finally {
      // Trigger refresh of login status
      await mutate();

      // Clear session variables
      lastPageStorage.clear();

      // Redirect to landing page
      history.push('/');
    }
  };
}
