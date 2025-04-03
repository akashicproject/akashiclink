import type { IBaseTransaction } from '@activeledger/sdk';
import { TransactionHandler } from '@activeledger/sdk';
import type { IKeyExtended } from '@activeledger/sdk-bip39';

enum ProductionContracts {
  Namespace = 'notabox.keys',
  Onboard = 'df9e4e242c58cc6a03ca1679f007c7a04cad72c97fdb74bdfe9a4e1688077a79@1.4.0',
}

enum TestNetContracts {
  Namespace = 'akashic',
  Onboard = 'b089a212ac22f57e2bef7d8a7f25702ebda98173939be2eba1ac0c2523d77383@1.5.0',
}

const Nitr0gen =
  process.env.NODE_ENV === 'prod' ? ProductionContracts : TestNetContracts;

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
  async onboardOtk(otk: IKeyExtended): Promise<IBaseTransaction> {
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
    return await txHandler.signTransaction(txBody, otk);
  },
};
