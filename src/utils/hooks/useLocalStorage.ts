import { useEffect, useState } from 'react';

/**
 * Access localStorage using the key. Also Expose a function to update and save value
 *
 * @param key The key of the localStorage item
 * @param defaultValue The default value returned when it is not saved before
 *
 * @returns {[value, setLocalStorageValue]} The value of the requested item, and the helper function to update the item
 *
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  const setLocalStorageValue = (newValue: T) => {
    setValue(newValue);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setLocalStorageValue];
};
