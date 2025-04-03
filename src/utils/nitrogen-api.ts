import type { IBaseTransaction } from '@activeledger/sdk';
import { TransactionHandler } from '@activeledger/sdk';
import type { IKey } from '@activeledger/sdk/lib/interfaces';
import type { IKeyExtended } from '@activeledger/sdk-bip39';
import type { IVerifyNftResponse } from '@helium-pay/backend';

import type { LocalAccount } from './hooks/useLocalAccounts';

enum Nitr0gen {
  NFTNamespace = 'candypig',
  NFTTransfer = '52e8ec2faef459da41fc4ed669644b4f07639bfdd871081763517e92973d3623@1.0.5',
}

const MINTER_OTK: IKey = {
  key: {
    pub: {
      pkcs8pem:
        '-----BEGIN PUBLIC KEY-----\nMFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAENPxgRnXy5/cx/x2ZXMhXhRhlBLkhqoCV\nr4scYTCjzJDbmJYZt0hzRZw99tYAD2i7hco9cG+TKKh8CManJcvgKA==\n-----END PUBLIC KEY-----',
      hash: 'd37fd3c06da3d2293b9102d0ab7d7b646770491fe40be53b0589071885135d75',
    },
    prv: {
      pkcs8pem:
        '-----BEGIN EC PRIVATE KEY-----\nMC4CAQEEIPpLySbN4hwlNfxsVV2wKYE56Kq+bc/n82+C5CKU0LNBoAcGBSuBBAAK\n-----END EC PRIVATE KEY-----',
      hash: '096e56037cd94695daf23763992bf78efc25a5f01a018c57d359d5802768eb82',
    },
  },
  name: 'otk',
  type: 'secp256k1',
};
const MINTEE_IDENTITY =
  'AS4c64c3c7b696aa275d0d2226538f22d5fdbe51ed31ec3b6e9910659cfa867348';
/**
 * Class implements basic intereactions with the Nirt0gen network
 */
export const Nitr0genApi = {
  transferNft: async (
    verifiedNft: IVerifyNftResponse,
    newOwnerIdentity: string,
    localOtks: IKeyExtended[],
    activeAccount: LocalAccount
  ): Promise<string> => {
    let signerOtk: IKey;
    if (verifiedNft.nftOwnerIdentity === MINTEE_IDENTITY) {
      signerOtk = MINTER_OTK;
    } else {
      const otk = localOtks?.find(
        (l) => l.identity === activeAccount?.identity
      );

      const { phrase: _, ...object } = otk ?? localOtks[0];
      signerOtk = object;
    }
    signerOtk.identity = verifiedNft.nftOwnerIdentity;
    // Build Transaction
    const txBody: IBaseTransaction = {
      $tx: {
        $namespace: Nitr0gen.NFTNamespace,
        $contract: Nitr0gen.NFTTransfer,
        $i: {
          nft: {
            $stream: verifiedNft.nftAcnsStreamId,
          },
        },
        $o: {
          owner: {
            $stream: newOwnerIdentity,
          },
        },
      },
      $sigs: {},
    };

    signerOtk.identity = verifiedNft.nftAcnsStreamId;
    // Sign Transaction & Send
    const txHandler = new TransactionHandler();
    return makeTxSafe(await txHandler.signTransaction(txBody, signerOtk));
  },
};

/**
 * Converts object to string, Encoding to base64 so doesn't get parsed by Nitr0gen gateway
 * or any other middleware which sees JSON strings (or JSON header) and wants to parse it automatically.
 */
function makeTxSafe(tx: object): string {
  return Buffer.from(JSON.stringify(tx)).toString('base64');
}
