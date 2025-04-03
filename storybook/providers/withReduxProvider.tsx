import type { StoryContext, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';

import { getMockStore } from '../mocks/store';
import type {
  mockAccountStoreParams,
  mockCreateWalletStoreParams,
} from '../mocks/store/slice';

const DEFAULT_STORE_PARAMS: {
  account: mockAccountStoreParams;
  createWallet: mockCreateWalletStoreParams;
} = {
  account: {
    hasLocalAccounts: true,
    hasActiveAccount: true,
    isLoggedIn: true,
  },
  createWallet: { hasPassword: false },
};

export const withReduxProvider = (
  Story: StoryFn,
  { parameters: { store = DEFAULT_STORE_PARAMS } }: StoryContext
) => {
  const params = {
    account: {
      ...DEFAULT_STORE_PARAMS['account'],
      ...store?.account,
    },
    createWallet: {
      ...DEFAULT_STORE_PARAMS['createWallet'],
      ...store?.createWallet,
    },
  };

  return (
    <Provider store={getMockStore(params)}>
      <Story />
    </Provider>
  );
};
