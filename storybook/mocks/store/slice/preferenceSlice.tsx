import type { PreferenceState } from '../../../../src/redux/slices/preferenceSlice';

export const getMockPreferenceSlice = (): {
  preferenceSlice: PreferenceState;
} => {
  return {
    preferenceSlice: {
      theme: 'light',
      autoLockTime: 10,
    },
  };
};
