import { OwnersAPI } from '../api';
import { Nitr0genApi } from '../nitr0gen/nitr0gen-api';
import { useAccountMe } from './useAccountMe';
import { useAccountStorage } from './useLocalAccounts';

export const useBecomeFxBp = () => {
  const { activeAccount } = useAccountStorage();
  const { data: account } = useAccountMe();
  const { cacheOtk } = useAccountStorage();

  return async () => {
    if (!cacheOtk || !activeAccount || !account) {
      throw new Error('CouldNotReadAddress');
    }
    const nitr0gen = new Nitr0genApi();

    const signedTx = await nitr0gen.afxOnboardTransaction(cacheOtk);

    await OwnersAPI.becomeFxBp({ signedTx });

    return `0xSuccess`;
  };
};
