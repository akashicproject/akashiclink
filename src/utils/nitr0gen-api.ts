// TODO: Merge this with "nitrogen-api" file
import type { IBaseTransaction } from '@activeledger/sdk';
import { TransactionHandler } from '@activeledger/sdk';
import type { IKeyExtended } from '@activeledger/sdk-bip39';
import type { CoinSymbol } from '@helium-pay/backend';
import { NetworkDictionary } from '@helium-pay/backend';

/**
 * basic info about a key created on Nitr0gen
 */
export interface Nitr0genCreatedKey {
  ledgerId: string;
  address: string;
  coinSymbol: CoinSymbol;
  hashes?: string[];
}

enum Nitr0gen {
  Namespace = 'notabox.keys',
  Onboard = 'df9e4e242c58cc6a03ca1679f007c7a04cad72c97fdb74bdfe9a4e1688077a79@1.4.0',
  Create = 'c278818b9f10d5f18381a711827e344d583f7ecf446cdfb4b92016b308838a72@2.0.3',
  DiffConsensus = 'a9711259f9c0322c6eb1cca4c0baf1b460266be79c5c0f78cf1602a8476e0744@1.0.1',
  AssignKeyClaim = '95191594af0ac9c197f0719bfce8d7f8788ef45e40133b841df3e143f4992cde@2.0.2',
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

  /**
   * Transaction to create keys (wallets) via nitr0gen
   */
  async keyCreateTransaction(
    coinSymbol: CoinSymbol,
    otk: IKeyExtended
  ): Promise<string> {
    // Build Transaction
    const txBody: IBaseTransaction = {
      $tx: {
        $namespace: Nitr0gen.Namespace,
        $contract: Nitr0gen.Create,
        $i: {
          owner: {
            $stream: otk.identity,
            symbol: NetworkDictionary[coinSymbol].nitr0gen,
          },
        },
      },
      $sigs: {},
      $selfsign: false,
    };

    // Sign Transaction & Send
    const txHandler = new TransactionHandler();
    return makeTxSafe(await txHandler.signTransaction(txBody, otk));
  },

  /**
   * Transaction to do a diffcon-check (checks that all parts are across the nodes ok) for a created key
   */
  async differentialConsensusTransaction(
    key: Nitr0genCreatedKey,
    otk: IKeyExtended
  ): Promise<string> {
    // Build Transaction
    const txBody: IBaseTransaction = {
      $tx: {
        $namespace: Nitr0gen.Namespace,
        $contract: Nitr0gen.DiffConsensus,
        $i: {
          owner: {
            $stream: otk.identity,
            address: key.address,
            hashes: key.hashes,
          },
        },
        $o: {
          key: {
            $stream: key.ledgerId,
          },
        },
      },
      $sigs: {},
      $selfsign: false,
    };

    // Sign Transaction & Send
    const txHandler = new TransactionHandler();
    return makeTxSafe(await txHandler.signTransaction(txBody, otk));
  },

  /**
   * Used to claim a pre-existing key on nitr0gen.
   */
  async keyClaimTransaction(
    keyLedgerId: string,
    otk: IKeyExtended
  ): Promise<string> {
    // Build Transaction
    const txBody: IBaseTransaction = {
      $tx: {
        $namespace: Nitr0gen.Namespace,
        $contract: Nitr0gen.AssignKeyClaim,
        $i: {
          owner: {
            $stream: otk.identity,
          },
        },
        $o: {
          key: {
            $stream: keyLedgerId,
          },
        },
      },
      $sigs: {},
      $selfsign: false,
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
