import { FiatCurrencySymbol } from '@akashic/as-backend';

import type { PreferenceState } from '../../../../src/redux/slices/preferenceSlice';

export const getMockPreferenceSlice = (): {
  preferenceSlice: PreferenceState;
} => {
  return {
    preferenceSlice: {
      fiatCurrencyDisplay: FiatCurrencySymbol.USD,
      theme: 'light',
      autoLockTime: 10,
    },
  };
};
