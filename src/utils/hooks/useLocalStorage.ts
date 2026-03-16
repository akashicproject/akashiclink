import { datadogRum } from '@datadog/browser-rum';
import { useEffect, useState } from 'react';

// TODO rewrite this to wrap https://github.com/capacitor-community/react-hooks?tab=readme-ov-file#storage-hooks
//  this API exposes async hook functions which is... not right.
//  I guess we need to preserve the datadog rum stuff though.

/**
 * Access localPreferences using the key. Also, expose a function to update and save value
 *
 * @param key The key of the localPreferences item
 * @param initialValue The default value returned when it is not saved before
 *
 * @returns {[value, setPreferenceAndStateValue, removePreference]}
 * The value of the requested item, and the helper function to update the item
 * and a direct read of the local Preferences value (useful when hook is used in multiple components)
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): {
  value: T;
  setValue: (newValue: T) => void;
  removeValue: () => void;
  refreshValue: () => void;
};

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): {
  value: T | undefined;
  setValue: (newValue: T) => void;
  removeValue: () => void;
  refreshValue: () => void;
};
export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): {
  value: T | undefined;
  setValue: (newValue: T) => void;
  removeValue: () => void;
  refreshValue: () => void;
} {
  const [stateValue, setStateValue] = useState<T>();

  function loadValue() {
    try {
      const result =
        typeof window !== 'undefined'
          ? localStorage.getItem(`CapacitorStorage.${key}`)
          : null;

      if (result === null && initialValue !== undefined) {
        setPreferenceAndStateValue(initialValue as T);
      } else if (result) {
        JSON.stringify(stateValue) !== result &&
          setStateValue(JSON.parse(result));
      } else {
        console.warn(key + ' preference value & initialValue not found');
      }
    } catch (e) {
      datadogRum.addError(e);
    }
  }

  const setPreferenceAndStateValue = (value: T) => {
    try {
      setStateValue(value);
      typeof window !== 'undefined' &&
        localStorage.setItem(`CapacitorStorage.${key}`, JSON.stringify(value));
    } catch (e) {
      datadogRum.addError(e);
      console.error(e);
    }
  };

  const removePreference = () => {
    try {
      setStateValue(undefined);
      typeof window !== 'undefined' &&
        localStorage.removeItem(`CapacitorStorage.${key}`);
    } catch (e) {
      datadogRum.addError(e);
      console.error(e);
    }
  };

  useEffect(() => {
    loadValue();
  }, [initialValue, key]);

  return {
    value: stateValue ?? initialValue,
    setValue: setPreferenceAndStateValue,
    removeValue: removePreference,
    refreshValue: loadValue,
  };
}
