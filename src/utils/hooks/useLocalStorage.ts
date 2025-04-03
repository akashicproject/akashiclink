import { useEffect, useState } from 'react';

/**
 * Access localStorage using the key. Also, expose a function to update and save value
 *
 * @param key The key of the localStorage item
 * @param defaultValue The default value returned when it is not saved before
 *
 * @returns {[value, setLocalStorageValue, getLocalStorageValue]}
 * The value of the requested item, and the helper function to update the item
 * and a direct read of the local storage value (useful when hook is used in multiple components)
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, T] => {
  const getLocalStorageValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [value, setValue] = useState<T>(() => getLocalStorageValue());

  const setLocalStorageValue = (newValue: T) => {
    setValue(newValue);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setLocalStorageValue, getLocalStorageValue()];
};
