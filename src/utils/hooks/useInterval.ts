import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay?: number) => {
  const savedCallback = useRef<(() => void) | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback?.current && savedCallback.current();
    }
    if (typeof delay === 'number') {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
