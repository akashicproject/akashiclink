import type {
  CreateWalletForm,
  CreateWalletState,
} from '../../../../src/redux/slices/createWalletSlice';
import { mockCacheOtk } from '../preset';

const mockCreateWalletForm: CreateWalletForm = {
  password: '',
  confirmPassPhrase: [],
  confirmPassword: '',
  checked: false,
};

export const mockCreateWalletState: CreateWalletState = {
  maskedPassPhrase: [],
  otk: mockCacheOtk,
  error: null,
  createWalletForm: mockCreateWalletForm,
};

export type mockCreateWalletStoreParams = {
  hasInputtedPassword: boolean;
};

export const getCreateWalletSlice = ({
  hasInputtedPassword = false,
}: mockCreateWalletStoreParams) => {
  return {
    createWalletSlice: {
      ...mockCreateWalletState,
      createWalletForm: {
        ...mockCreateWalletForm,
        password: hasInputtedPassword ? 'Test1234' : '',
      },
    },
  };
};
