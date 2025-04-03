import type { IBaseTransaction } from '@activeledger/sdk';
import { TransactionHandler } from '@activeledger/sdk';
import type { IKeyExtended } from '@activeledger/sdk-bip39';

enum Nitr0gen {
  Namespace = 'notabox.keys',
  Onboard = 'df9e4e242c58cc6a03ca1679f007c7a04cad72c97fdb74bdfe9a4e1688077a79@1.4.0',
}

export async function signTxBody<T extends IBaseTransaction>(
  txBody: T,
  otk: IKeyExtended
): Promise<T> {
  const txHandler = new TransactionHandler();
  return await txHandler.signTransaction(txBody, otk);
}

/**
 * Class implements basic interactions with the Nitr0gen network
 */
export const Nitr0genApi = {
  /**
   * Transaction to onboard otk to nitr0gen, giving it an identity
   */
  async onboardOtk(otk: IKeyExtended) {
    const txBody: IBaseTransaction = {
      $tx: {
        $namespace: Nitr0gen.Namespace,
        $contract: Nitr0gen.Onboard,
        $i: {
          otk: {
            publicKey: otk.key.pub.pkcs8pem,
            type: otk.type,
          },
        },
      },
      $sigs: {},
      $selfsign: true,
    };

    // Sign Transaction & Send
    const txHandler = new TransactionHandler();
    return makeTxSafe(await txHandler.signTransaction(txBody, otk));
  },
};

/**
 * Converts object to string, Encoding to base64 so doesn't get parsed by Nitr0gen gateway
 * or any other middleware which sees JSON strings (or JSON header) and wants to parse it automatically.
 */
function makeTxSafe(tx: object): string {
  return Buffer.from(JSON.stringify(tx)).toString('base64');
}
