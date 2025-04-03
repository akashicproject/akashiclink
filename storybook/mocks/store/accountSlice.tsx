import {
  PRESET_L2_ADDRESS,
  PRESET_L2_ADDRESS_2,
  PRESET_NFT_ALIAS,
  PRESET_NFT_LEDGER_ID,
} from '@helium-pay/api-mocks';

import { makeStore } from '../../../src/redux/app/store';

export const mockActiveAccount = {
  identity: PRESET_L2_ADDRESS,
  alias: PRESET_NFT_ALIAS,
  ledgerId: PRESET_NFT_LEDGER_ID,
};

export const mockLocalAccounts = [
  mockActiveAccount,
  {
    identity: PRESET_L2_ADDRESS_2,
  },
];

export const mockCacheOtk = {
  key: {
    prv: {
      pkcs8pem: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
    pub: {
      pkcs8pem: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
  },
  type: 'secp256k1',
  name: 'otk',
  identity: PRESET_L2_ADDRESS,
};

export const getMockStore = ({
  hasLocalAccounts = true,
  hasActiveAccount = true,
  hasCacheOtk = true,
}) => {
  return makeStore({
    accountSlice: {
      localAccounts: hasLocalAccounts ? mockLocalAccounts : [],
      activeAccount: hasActiveAccount ? mockActiveAccount : null,
      cacheOtk: hasCacheOtk ? mockCacheOtk : null,
    },
  });
};
