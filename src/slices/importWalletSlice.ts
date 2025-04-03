import type { IKeyExtended } from '@activeledger/sdk-bip39';
import { IMPORT_CONST, userError } from '@helium-pay/backend';
import type { PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { createAppSlice } from '../app/createAppSlice';
import { urls } from '../constants/urls';
import { history } from '../history';
import { akashicPayPath } from '../routing/navigation-tabs';
import { OwnersAPI } from '../utils/api';
import type { FullOtk } from '../utils/otk-generation';
import {
  restoreOtk,
  restoreOtkFromKeypair,
  signImportAuth,
} from '../utils/otk-generation';

export interface ImportWalletForm {
  password?: string;
  confirmPassword?: string;
  passPhrase?: string[];
  checked?: boolean;
  privateKey?: string;
}

export interface ImportWalletState {
  otk: FullOtk | null;
  importWalletForm: ImportWalletForm;
}

const initialState: ImportWalletState = {
  otk: null,
  importWalletForm: {
    password: '',
    confirmPassword: '',
    passPhrase: new Array(12).fill(''),
    privateKey: '',
    checked: false,
  },
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const importWalletSlice = createAppSlice({
  name: 'importWalletSlice',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    onInputChange: create.reducer(
      (state, action: PayloadAction<ImportWalletForm>) => {
        return {
          ...state,
          importWalletForm: {
            ...state.importWalletForm,
            ...action.payload,
          },
        };
      }
    ),
    onClear: create.reducer(() => {
      return initialState;
    }),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    reconstructOtkAsync: create.asyncThunk(
      async (passPhrase: string[]) => {
        // Reconstruct OTK
        const reconstructedOtk = await restoreOtk(passPhrase.join(' '));
        const { identity, username } = await OwnersAPI.importAccount({
          publicKey: reconstructedOtk.key.pub.pkcs8pem,
          signedAuth: signImportAuth(
            reconstructedOtk.key.prv.pkcs8pem,
            IMPORT_CONST
          ),
        });
        if (identity) {
          history.push({
            pathname: akashicPayPath(urls.importWalletPassword),
          });
          return { ...reconstructedOtk, identity };
        } else if (username) {
          history.push({
            pathname: akashicPayPath(urls.migrateWalletNotice),
            state: {
              migrateWallet: {
                username,
              },
            },
          });
          return null;
        } else {
          throw new Error('GenericFailureMsg');
        }
      },
      {
        fulfilled: (state, action) => {
          state.otk = action.payload;
        },
        rejected: () => {
          throw new Error('GenericFailureMsg');
        },
      }
    ),
    restoreOtkFromKeypairAsync: create.asyncThunk(
      async (privateKey: string) => {
        // Restore OTK from keypair
        let otk: IKeyExtended = restoreOtkFromKeypair(privateKey);
        let username: string | undefined;
        let identity: string | undefined;
        try {
          const response = await OwnersAPI.importAccount({
            publicKey: otk.key.pub.pkcs8pem,
            signedAuth: signImportAuth(privateKey, IMPORT_CONST),
          });
          identity = response.identity;
          username = response.username;
        } catch (e) {
          // This error could be because of a bug where we have some otks stored "compressed" and some "uncompressed"
          // So if facing this error, we try again with "uncompressed"
          if (
            isAxiosError(e) &&
            e.response?.data.message === userError.userNotFoundError
          ) {
            otk = restoreOtkFromKeypair(privateKey, 'uncompressed');
            const response = await OwnersAPI.importAccount({
              publicKey: otk.key.pub.pkcs8pem,
              signedAuth: signImportAuth(privateKey, IMPORT_CONST),
            });
            identity = response.identity;
            username = response.username;
          }
        }
        // The value we return becomes the `fulfilled` action payload
        if (identity) {
          history.push({
            pathname: akashicPayPath(urls.importWalletPassword),
          });
          return { ...otk, identity };
        } else if (username) {
          history.push({
            pathname: akashicPayPath(urls.migrateWalletNotice),
            state: {
              migrateWallet: {
                username,
              },
            },
          });
          return null;
        } else {
          throw new Error('GenericFailureMsg');
        }
      },
      {
        fulfilled: (state, action) => {
          state.otk = action.payload;
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
    selectImportWalletForm: (importWallet) => importWallet.importWalletForm,
    selectOtk: (importWallet) => importWallet.otk,
  },
});

// Action creators are generated for each case reducer function.
export const {
  onInputChange,
  onClear,
  reconstructOtkAsync,
  restoreOtkFromKeypairAsync,
} = importWalletSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectImportWalletForm, selectOtk } =
  importWalletSlice.selectors;
