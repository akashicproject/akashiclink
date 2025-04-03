import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import { combineReducers } from 'redux';

import { accountSlice } from '../slices/accountSlice';
import { createWalletSlice } from '../slices/createWalletSlice';
import { importWalletSlice } from '../slices/importWalletSlice';
import { migrateWalletSlice } from '../slices/migrateWalletSlice';
import { preferenceSlice } from '../slices/preferenceSlice';

// use `combineReducers` instead of `combineSlices`
// for redux-persist and conntected-react-router
const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    createWalletSlice: createWalletSlice.reducer,
    importWalletSlice: importWalletSlice.reducer,
    migrateWalletSlice: migrateWalletSlice.reducer,
    preferenceSlice: preferenceSlice.reducer,
    accountSlice: accountSlice.reducer,
  });

// eslint-disable-next-line import/no-default-export
export default createRootReducer;
