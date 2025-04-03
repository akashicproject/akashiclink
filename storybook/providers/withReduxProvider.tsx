import type { StoryContext, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';

import { getMockStore } from '../mocks/store/accountSlice';

export const withReduxProvider = (
  Story: StoryFn,
  {
    parameters: {
      hasLocalAccounts = true,
      hasActiveAccount = true,
      isLoggedIn = true,
    },
  }: StoryContext
) => {
  return (
    <Provider
      store={getMockStore({
        hasActiveAccount,
        hasLocalAccounts,
        hasCacheOtk: isLoggedIn,
      })}
    >
      <Story />
    </Provider>
  );
};
