import { ActiveCrypto } from '@activeledger/activecrypto';
import type { IKeyExtended } from '@activeledger/sdk-bip39';
import { KeyHandler } from '@activeledger/sdk-bip39';

// Generate a purely client-side otk. Only used for authorization in the first instance
export async function generateOTK(): Promise<IKeyExtended> {
  const kh = new KeyHandler();
  return await kh.generateBIP39Key('otk', true);
}

// Sign a piece of data (email) using the private key to be verified by the backend
export function signImportAuth(otkPriv: string, email: string) {
  // Have to but private key into correct format
  const pemPrivate =
    '-----BEGIN EC PRIVATE KEY-----\n' +
    `${otkPriv}\n` +
    '-----END EC PRIVATE KEY-----';

  const kp = new ActiveCrypto.KeyPair('secp256k1', pemPrivate);
  return kp.sign(email);
}
