import { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

import { useAppSelector } from '../../redux/app/hooks';
import { selectAutoLockTime } from '../../redux/slices/preferenceSlice';
import { APP_AUTO_LOCK_BY } from '../preference-keys';
import { useLocalStorage } from './useLocalStorage';
import { useLogout } from './useLogout';

export function useIdleTime() {
  const autoLockTime = useAppSelector(selectAutoLockTime);
  const { value: autoLockBy, setValue: setAutoLockBy } = useLocalStorage(
    APP_AUTO_LOCK_BY,
    0
  );
  const logout = useLogout();
  const { reset } = useIdleTimer({
    timeout: autoLockTime * 60000,
    onIdle: logout,
    throttle: 200,
    events: [
      'click',
      'dblclick',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange',
    ],
    onAction: async () => {
      const newVal = Date.now() + autoLockTime * 60 * 1000;
      await setAutoLockBy(newVal);

      try {
        // Also saving this to chrome extension for direct access
        await chrome?.storage?.session?.set({
          [APP_AUTO_LOCK_BY]: newVal,
        });
      } catch (e) {
        console.warn(e);
      }
    },
  });

  useEffect(() => {
    const checkExtensionAutoLock = async () => {
      try {
        // Check if chrome?.storage?.session still exist
        // if not, indicated that user has quited chrome before
        const extensionAutoLockVal =
          await chrome?.storage?.session?.get(APP_AUTO_LOCK_BY);

        if (!extensionAutoLockVal?.autoLockBy) {
          logout();
        }
      } catch (e) {
        console.warn(e);
      }
    };
    checkExtensionAutoLock();
  }, []);

  useEffect(() => {
    // on soft close autoLockBy is initially 0 and after the Preference is resolved it get its actual value, hence the condition autoLock === 0
    if (autoLockBy === 0) return;
    if (autoLockBy > Date.now()) {
      reset();
    } else {
      logout();
    }
  }, [autoLockTime, autoLockBy]);
}
