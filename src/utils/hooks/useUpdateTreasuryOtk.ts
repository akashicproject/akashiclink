import { OwnersAPI } from '../api';
import { type IAcTreasuryThresholds } from '../nitr0gen/nitr0gen.interface';
import { Nitr0genApi } from '../nitr0gen/nitr0gen-api';
import { useAccountMe } from './useAccountMe';
import { useAccountStorage } from './useLocalAccounts';

type UpdateTreasuryKeyPayload = {
  networkThresholds?: IAcTreasuryThresholds;
};

export const useUpdateTreasuryOtk = () => {
  const { activeAccount } = useAccountStorage();
  const { data: account } = useAccountMe();
  const { cacheOtk } = useAccountStorage();

  return async (payload: UpdateTreasuryKeyPayload) => {
    if (!cacheOtk || !activeAccount || !account) {
      throw new Error('CouldNotReadAddress');
    }

    if (!payload.networkThresholds) {
      throw new Error('Need some sort of threshold to update treasury key!');
    }

    const nitr0gen = new Nitr0genApi();
    const signedTx = await nitr0gen.updateTreasuryOtkTransaction(
      cacheOtk,
      payload.networkThresholds
    );

    await OwnersAPI.updateTreasuryOtk({
      signedTx,
    });

    // Inform AP of success
    return `OxSUCCESS`;
  };
};
