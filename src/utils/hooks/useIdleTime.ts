import { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

import { useLogout } from './useLogout';

export function useIdleTime(lockTime: number) {
  const logout = useLogout();
  const { reset } = useIdleTimer({
    timeout: lockTime * 60000,
    onIdle: logout,
  });
  useEffect(() => {
    reset();
  }, [lockTime]);
}
