import { useTranslation } from 'react-i18next';

import { ALLOWED_NETWORKS } from '../../constants/currencies';
import { type DepositChainOption } from './useAccountL1Address';
import { useAccountStorage } from './useLocalAccounts';

export type CryptoChainAddress = {
  displayName: string;
  chain: DepositChainOption;
  address: string;
};

export const useAccountL1Address = () => {
  const { t } = useTranslation();
  const { activeAccount } = useAccountStorage();

  const currencies: CryptoChainAddress[] = [
    {
      displayName: t('Chain.AkashicChain'),
      chain: 'AkashicChain',
      address: activeAccount?.identity ?? '',
    },
    ...ALLOWED_NETWORKS.map((chain) => ({
      displayName: t(`Chain.${chain.toUpperCase()}`),
      chain,
      address:
        activeAccount?.localStoredL1Addresses?.find(
          (address) =>
            address.coinSymbol.toLowerCase() === chain.toLowerCase() &&
            typeof address.address === 'string'
        )?.address ?? '',
    })),
  ];
  return currencies;
};
