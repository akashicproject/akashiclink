import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

import { useLogout } from './useLogout';

export function useIdleTime(lockTime: number) {
  const logout = useLogout();
  const { reset, getRemainingTime } = useIdleTimer({
    timeout: lockTime * 60000,
    onIdle: logout,
  });
  useEffect(() => {
    reset();
  }, [lockTime]);
}
