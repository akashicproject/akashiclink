import { Provider } from 'react-redux';

import { makeStore } from '../../src/redux/app/store';

const store = makeStore({
  accountSlice: {
    localAccounts: [
      {
        identity:
          'AS584b1cdf4e6ed75d6e4102b743b5c5996e139490c7163521b108537c5ee32682',
        alias: 'Volkswagen-TEST1',
        ledgerId:
          'AS017e4bfeb9c3931d32d3980961ece280171296048e18e9b62083fa0ee89c2d51',
      },
      {
        identity:
          'ASae6432b74f3f4ecee653537e08de6afe257e88985243bfedb5d8baa4a530d528',
      },
    ],
    activeAccount: {
      identity:
        'AS584b1cdf4e6ed75d6e4102b743b5c5996e139490c7163521b108537c5ee32682',
      alias: 'Volkswagen-TEST1',
      ledgerId:
        'AS017e4bfeb9c3931d32d3980961ece280171296048e18e9b62083fa0ee89c2d51',
      accountName: 'Account 5ee32682',
    },
    cacheOtk: null,
  },
});

export const withReduxProvider = (Story: any) => {
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};
