import { type IBaseAcTransaction } from '@akashic/as-backend';

import { useAppSelector } from '../../redux/app/hooks';
import { selectCacheOtk } from '../../redux/slices/accountSlice';
import { signData } from '../otk-generation';

export const useSignMessage = () => {
  const cacheOtk = useAppSelector(selectCacheOtk);

  return (
    payloadToSign: IBaseAcTransaction['$tx'] | Record<string, unknown>
  ) => {
    if (!cacheOtk) {
      throw new Error('cacheOtk not found');
    }

    return signData(cacheOtk.key.prv.pkcs8pem, payloadToSign);
  };
};
