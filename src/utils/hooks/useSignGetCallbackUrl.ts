import { datadogRum } from '@datadog/browser-rum';
import type { ISignedByOTK } from '@helium-pay/backend/src/modules/api-interfaces/auth/signed-by-otk.interface';

import { useAppSelector } from '../../redux/app/hooks';
import { selectCacheOtk } from '../../redux/slices/accountSlice';
import { signAuthenticationData } from '../otk-generation';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';

export type GetCallbackUrlsToSign = Omit<ISignedByOTK, 'signature'>;

export const useSignGetCallbackUrl = () => {
  const cacheOtk = useAppSelector(selectCacheOtk);

  return async (getCallbackUrls: GetCallbackUrlsToSign) => {
    try {
      if (!cacheOtk) {
        throw new Error('GenericFailureMsg');
      }

      // WalletConnect requires the 0x-prefix
      return (
        '0x' +
        signAuthenticationData(cacheOtk.key.prv.pkcs8pem, getCallbackUrls)
      );
    } catch (error) {
      datadogRum.addError(error);
      return unpackRequestErrorMessage(error);
    }
  };
};
