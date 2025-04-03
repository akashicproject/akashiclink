import { datadogRum } from '@datadog/browser-rum';

import { useAppSelector } from '../../redux/app/hooks';
import { selectCacheOtk } from '../../redux/slices/accountSlice';
import { unpackRequestErrorMessage } from '../unpack-request-error-message';

export const useSignBecomeBpMessage = () => {
  const cacheOtk = useAppSelector(selectCacheOtk);

  return async () => {
    try {
      if (!cacheOtk) {
        return 'GenericFailureMsg';
      }

      // TODO: could be Nitr0genApi.onboardOtkToBP(otk)
      // await Nitr0genApi.onboardOtk(otk)

      return '0xsignedMessageHere';
    } catch (error) {
      datadogRum.addError(error);
      return unpackRequestErrorMessage(error);
    }
  };
};
