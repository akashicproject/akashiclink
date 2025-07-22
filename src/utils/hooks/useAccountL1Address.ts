import { type CoinSymbol } from '@helium-pay/backend';

import { ALLOWED_NETWORKS } from '../../constants/currencies';
import { useAccountStorage } from './useLocalAccounts';

export type DepositChainOption = CoinSymbol | 'AkashicChain';

export const useAccountL1Address = (
  chain: DepositChainOption | undefined
): {
  address: string | undefined;
  isChainAllowed: boolean;
  isAC: boolean;
} => {
  const { activeAccount } = useAccountStorage();

  const isAC = chain === 'AkashicChain';

  const localStoredL1Address = activeAccount?.localStoredL1Addresses?.find(
    (a) =>
      a.coinSymbol.toLowerCase() === chain?.toLowerCase() &&
      typeof a.address === 'string'
  )?.address;

  return {
    address: isAC ? activeAccount?.identity : localStoredL1Address,
    isChainAllowed: !isAC && !!(chain && ALLOWED_NETWORKS.includes(chain)),
    isAC: chain === 'AkashicChain',
  };
};
