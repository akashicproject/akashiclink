import { Preferences } from '@capacitor/preferences';
import { useEffect, useState } from 'react';

/**
 * Access localPreferences using the key. Also, expose a function to update and save value
 *
 * @param key The key of the localPreferences item
 * @param initialValue The default value returned when it is not saved before
 *
 * @returns {[value, setPreferenceAndStateValue]}
 * The value of the requested item, and the helper function to update the item
 * and a direct read of the local Preferences value (useful when hook is used in multiple components)
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => Promise<void>] => {
  const [stateValue, setStateValue] = useState<T>();

  useEffect(() => {
    async function loadValue() {
      try {
        const result = await Preferences.get({ key });

        if (result.value == undefined && initialValue != undefined) {
          await setPreferenceAndStateValue(initialValue as T);
        } else {
          if (result.value) {
            JSON.stringify(stateValue) !== result.value &&
              setStateValue(JSON.parse(result.value));
          } else {
            console.warn(
              'preference value not found, initialValue value not found'
            );
          }
        }
      } catch (e) {
        return initialValue;
      }
    }
    loadValue();
  }, [initialValue, key]);

  const setPreferenceAndStateValue = async (value: T) => {
    try {
      setStateValue(value);
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    } catch (e) {
      console.error(e);
    }
  };
  return [stateValue ?? initialValue, setPreferenceAndStateValue];
};
