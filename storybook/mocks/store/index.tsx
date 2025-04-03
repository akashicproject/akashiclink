import { makeStore } from '../../../src/redux/app/store';
import type {
  mockAccountStoreParams,
  mockCreateWalletStoreParams,
} from './slice';
import { getCreateWalletSlice, getMockAccountSlice } from './slice';

export const getMockStore = ({
  account,
  createWallet,
}: {
  account: mockAccountStoreParams;
  createWallet: mockCreateWalletStoreParams;
}) => {
  return makeStore({
    ...getMockAccountSlice(account),
    ...getCreateWalletSlice(createWallet),
  });
};
