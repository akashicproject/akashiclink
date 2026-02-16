import type { PayloadAction } from '@reduxjs/toolkit';

import { type ThemeType, themeType } from '../../theme/const';
import { createAppSlice } from '../app/createAppSlice';

export interface PreferenceState {
  theme: ThemeType;
  autoLockTime: number;
}

const initialState: PreferenceState = {
  theme: themeType.SYSTEM as ThemeType,
  autoLockTime: 10,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const preferenceSlice = createAppSlice({
  name: 'preferenceSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    setTheme: create.reducer((state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
    }),
    setAutoLockTime: create.reducer((state, action: PayloadAction<number>) => {
      state.autoLockTime = action.payload;
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectTheme: (preference) => {
      if (preference.theme === themeType.SYSTEM) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? themeType.DARK
          : themeType.LIGHT;
      }
      return preference.theme;
    },
    selectAutoLockTime: (preference) => preference.autoLockTime,
  },
});

// Action creators are generated for each case reducer function.
export const { setTheme, setAutoLockTime } = preferenceSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectTheme, selectAutoLockTime } = preferenceSlice.selectors;
