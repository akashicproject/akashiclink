import { OwnersAPI } from '../api';
import { Nitr0genApi } from '../nitr0gen/nitr0gen-api';
import { type FullOtk, generateOTK } from '../otk-generation';
import { useAccountMe } from './useAccountMe';
import { useAccountStorage } from './useLocalAccounts';

type SecondaryKeyPayload = {
  oldPubKeyToRemove?: string;
  treasuryKey?: boolean;
};

export const useGenerateSecondaryOtk = () => {
  const { activeAccount } = useAccountStorage();
  const { data: account } = useAccountMe();
  const { cacheOtk } = useAccountStorage();

  return async (payload: SecondaryKeyPayload) => {
    if (!cacheOtk || !activeAccount || !account) {
      throw new Error('cacheOtk not found');
    }
    const nitr0gen = new Nitr0genApi();

    // generate a new otk
    const secondaryOtk = (await generateOTK()) as FullOtk;

    const signedTx = await nitr0gen.secondaryOtkTransaction(
      cacheOtk,
      secondaryOtk.key.pub.pkcs8pem,
      payload.oldPubKeyToRemove,
      payload.treasuryKey
    );

    await OwnersAPI.generateSecondaryOtk({
      signedTx,
      treasuryKey: payload.treasuryKey,
    });

    // return the new private key to frontend
    return `0x${secondaryOtk.key.prv.pkcs8pem}-${secondaryOtk.key.pub.pkcs8pem}`;
  };
};
