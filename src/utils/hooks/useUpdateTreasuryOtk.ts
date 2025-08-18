import { datadogRum } from '@datadog/browser-rum';

import { OwnersAPI } from '../api';
import { type IAcTreasuryThresholds } from '../nitr0gen/nitr0gen.interface';
import { Nitr0genApi } from '../nitr0gen/nitr0gen-api';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';
import { useAccountMe } from './useAccountMe';
import { useAccountStorage } from './useLocalAccounts';

type UpdateTreasuryKeyPayload = {
  networkThresholds?: IAcTreasuryThresholds;
  globalThreshold?: string;
};

export const useUpdateTreasuryOtk = () => {
  const { activeAccount } = useAccountStorage();
  const { data: account } = useAccountMe();
  const { cacheOtk } = useAccountStorage();

  return async (payload: UpdateTreasuryKeyPayload) => {
    try {
      if (!cacheOtk || !activeAccount || !account) {
        throw new Error('CouldNotReadAddress');
      }

      if (!payload.globalThreshold && !payload.networkThresholds) {
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
    } catch (e: unknown) {
      const error = e as Error;

      datadogRum.addError(error);

      // Special return in case updating the OTK fails. Used to prompt a message on AP to retry
      return `0xERROR-${
        error.message === 'CouldNotReadAddress'
          ? 'CouldNotReadAddress'
          : unpackRequestErrorMessage(error)
      }`;
    }
  };
};
