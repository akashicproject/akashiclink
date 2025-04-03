import { datadogRum } from '@datadog/browser-rum';
import type { ISignedByOTK } from '@helium-pay/backend/src/modules/api-interfaces/auth/signed-by-otk.interface';

import { useAppSelector } from '../../redux/app/hooks';
import { selectCacheOtk } from '../../redux/slices/accountSlice';
import { signAuthenticationData } from '../otk-generation';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';

export type GetWhitelistIpsToSign = Omit<ISignedByOTK, 'signature'>;

export const useSignGetWhitelistIps = () => {
  const cacheOtk = useAppSelector(selectCacheOtk);

  return async (getWhitelistIps: GetWhitelistIpsToSign) => {
    try {
      if (!cacheOtk) {
        throw new Error('GenericFailureMsg');
      }

      // WalletConnect requires the 0x-prefix
      return (
        '0x' +
        signAuthenticationData(cacheOtk.key.prv.pkcs8pem, getWhitelistIps)
      );
    } catch (error) {
      datadogRum.addError(error);
      return unpackRequestErrorMessage(error);
    }
  };
};
