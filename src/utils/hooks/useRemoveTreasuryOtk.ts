import { OwnersAPI } from '../api';
import { Nitr0genApi } from '../nitr0gen/nitr0gen-api';
import { useAccountMe } from './useAccountMe';
import { useAccountStorage } from './useLocalAccounts';

type RemoveTreasuryKeyPayload = {
  oldPubKeyToRemove: string;
};

export const useRemoveTreasuryOtk = () => {
  const { activeAccount } = useAccountStorage();
  const { data: account } = useAccountMe();
  const { cacheOtk } = useAccountStorage();

  return async (payload: RemoveTreasuryKeyPayload) => {
    if (!cacheOtk || !activeAccount || !account) {
      throw new Error('CouldNotReadAddress');
    }
    const nitr0gen = new Nitr0genApi();

    const signedTx = await nitr0gen.removeTreasuryOtkTransaction(
      cacheOtk,
      payload.oldPubKeyToRemove
    );

    await OwnersAPI.removeTreasuryOtk({
      signedTx,
    });
    // Inform AP of success
    return `0xSUCCESS`;
  };
};
