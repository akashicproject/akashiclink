import type { IBecomeBp } from '@akashic/as-backend';

import { useAppSelector } from '../../redux/app/hooks';
import { selectCacheOtk } from '../../redux/slices/accountSlice';
import { signAuthenticationData } from '../otk-generation';

export type AuthorizeActionToSign = Omit<IBecomeBp, 'signature'> &
  Record<string, unknown>;

export const useSignAuthorizeActionMessage = () => {
  const cacheOtk = useAppSelector(selectCacheOtk);

  return async (payloadToSign: AuthorizeActionToSign) => {
    if (!cacheOtk) {
      throw new Error('cacheOtk not found');
    }

    // WalletConnect requires the 0x-prefix
    return (
      '0x' + signAuthenticationData(cacheOtk.key.prv.pkcs8pem, payloadToSign)
    );
  };
};
