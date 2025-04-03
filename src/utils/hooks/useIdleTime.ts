import { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

import { useAppSelector } from '../../redux/app/hooks';
import { selectAutoLockTime } from '../../redux/slices/preferenceSlice';
import { useLogout } from './useLogout';

export function useIdleTime() {
  const autoLockTime = useAppSelector(selectAutoLockTime);
  const logout = useLogout();
  const { reset } = useIdleTimer({
    timeout: autoLockTime * 60000,
    onIdle: logout,
  });
  useEffect(() => {
    reset();
  }, [autoLockTime]);
}
