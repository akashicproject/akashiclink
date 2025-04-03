import type { PayloadAction } from '@reduxjs/toolkit';

import { createAppSlice } from '../app/createAppSlice';
import type { FullOtk } from '../utils/otk-generation';
import { generateOTK } from '../utils/otk-generation';
import { getRandomNumbers } from '../utils/random-utils';

export interface MigrateWalletForm {
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
  confirmPassPhrase?: string[];
  checked?: boolean;
  privateKey?: string;
}

export interface MigrateWalletState {
  maskedPassPhrase: string[];
  otk: FullOtk | null;
  username?: string;
  migrateWalletForm: MigrateWalletForm;
}

const initialState: MigrateWalletState = {
  maskedPassPhrase: new Array(12).fill(''),
  otk: null,
  username: '',
  migrateWalletForm: {
    oldPassword: '',
    password: '',
    confirmPassword: '',
    confirmPassPhrase: new Array(12).fill(''),
    privateKey: '',
    checked: false,
  },
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const migrateWalletSlice = createAppSlice({
  name: 'migrateWalletSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    onInputChange: create.reducer(
      (state, action: PayloadAction<MigrateWalletForm>) => {
        return {
          ...state,
          migrateWalletForm: {
            ...state.migrateWalletForm,
            ...action.payload,
          },
        };
      }
    ),
    setUsername: create.reducer((state, action: PayloadAction<string>) => {
      state.username = action.payload;
    }),
    onClear: create.reducer(() => {
      return initialState;
    }),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    generateOtkAsync: create.asyncThunk(
      async () => {
        // Generate OTK
        const otk = (await generateOTK()) as FullOtk;
        const randomNumberArray = getRandomNumbers(0, 11, 4);
        const maskedPassPhrase = otk.phrase!.split(' ');
        randomNumberArray.forEach((e) => {
          maskedPassPhrase[e] = '';
        });
        // The value we return becomes the `fulfilled` action payload
        return {
          otk,
          maskedPassPhrase,
        };
      },
      {
        fulfilled: (state, action) => {
          // state.otkStatus = "idle"
          state.otk = action.payload.otk;
          state.maskedPassPhrase = action.payload.maskedPassPhrase;
        },
        rejected: () => {
          throw new Error('GenericFailureMsg');
        },
      }
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectMigrateWalletForm: (importWallet) => importWallet.migrateWalletForm,
    selectMaskedPassPhrase: (createWallet) => createWallet.maskedPassPhrase,
    selectOtk: (importWallet) => importWallet.otk,
    selectUsername: (importWallet) => importWallet.username,
  },
});

// Action creators are generated for each case reducer function.
export const { onInputChange, onClear, setUsername, generateOtkAsync } =
  migrateWalletSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectMigrateWalletForm,
  selectMaskedPassPhrase,
  selectOtk,
  selectUsername,
} = migrateWalletSlice.selectors;
