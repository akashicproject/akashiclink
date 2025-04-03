import { axiosBase } from '../utils/axios-helper';
import { useOwner } from '../utils/hooks/useOwner';
import { lastPageStorage } from '../utils/last-page-storage';

/**
 * Hook that logs user out and clears all session settings
 */
export function useLogout(callLogout = true) {
  const { mutate } = useOwner();

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
    await lastPageStorage.clear();

    // Trigger refresh of login status
    await mutate();
  };
}
