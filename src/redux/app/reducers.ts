import { connectRouter } from 'connected-react-router';
import type { History } from 'history';
import { combineReducers } from 'redux';

import { createWalletSlice } from '../slices/createWalletSlice';
import { importWalletSlice } from '../slices/importWalletSlice';
import { migrateWalletSlice } from '../slices/migrateWalletSlice';

// use `combineReducers` instead of `combineSlices`
// for redux-persist and conntected-react-router
const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    createWalletSlice: createWalletSlice.reducer,
    importWalletSlice: importWalletSlice.reducer,
    migrateWalletSlice: migrateWalletSlice.reducer,
  });

// eslint-disable-next-line import/no-default-export
export default createRootReducer;
