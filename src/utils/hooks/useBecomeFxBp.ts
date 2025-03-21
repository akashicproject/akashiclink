import { datadogRum } from '@datadog/browser-rum';

import { OwnersAPI } from '../api';
import { Nitr0genApi } from '../nitr0gen/nitr0gen-api';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';
import { useAccountMe } from './useAccountMe';
import { useAccountStorage } from './useLocalAccounts';

export const useBecomeFxBp = () => {
  const { activeAccount } = useAccountStorage();
  const { data: account } = useAccountMe();
  const { cacheOtk } = useAccountStorage();

  return async () => {
    try {
      if (!cacheOtk || !activeAccount || !account) {
        throw new Error('CouldNotReadAddress');
      }
      const nitr0gen = new Nitr0genApi();

      const signedTx = await nitr0gen.afxOnboardTransaction(cacheOtk);

      await OwnersAPI.becomeFxBp({ signedTx });

      return `0xSuccess`;

      // return the new private key to frontend
    } catch (e: unknown) {
      const error = e as Error;

      datadogRum.addError(error);

      // Special return in case assigning the new OTK fails. Used to prompt a message on AP to retry
      return `0xERROR-${
        error.message === 'CouldNotReadAddress'
          ? 'CouldNotReadAddress'
          : unpackRequestErrorMessage(error)
      }`;
    }
  };
};
