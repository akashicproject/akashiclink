// TODO: Merge this with "nitrogen-api" file
import type { IBaseTransaction } from '@activeledger/sdk';
import { TransactionHandler } from '@activeledger/sdk';
import type { IKeyExtended } from '@activeledger/sdk-bip39';
import type {
  CoinSymbol,
  ITransactionVerifyResponse,
  IVerifyNftResponse,
} from '@helium-pay/backend';
import { NetworkDictionary } from '@helium-pay/backend';

import { convertToFromDecimals } from './currency';
import type { FullOtk } from './otk-generation';

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
  NFTNamespace = 'candypig',
  Onboard = 'df9e4e242c58cc6a03ca1679f007c7a04cad72c97fdb74bdfe9a4e1688077a79@1.4.0',
  Create = 'c278818b9f10d5f18381a711827e344d583f7ecf446cdfb4b92016b308838a72@2.0.3',
  DiffConsensus = 'a9711259f9c0322c6eb1cca4c0baf1b460266be79c5c0f78cf1602a8476e0744@1.0.1',
  AssignKeyClaim = '95191594af0ac9c197f0719bfce8d7f8788ef45e40133b841df3e143f4992cde@2.0.2',
  NFTTransfer = '52e8ec2faef459da41fc4ed669644b4f07639bfdd871081763517e92973d3623@1.0.5',
  NFTAcnsRecord = '29a20530ecc5f835ceb55bb1f27a329f5ac8126f53630ce79535675af0f2f184@1.0.0',
  CryptoTransfer = 'a48df2fd31400a9b69d9b8bdb699618faed2999ca08c559695a4b74597d3e895@2.0.2',
}

const nitr0genNativeCoin = '#native';
const AP_FEE_IDENTITY =
  'be45ec32caf53998e4d8d51feca112c82d334007d2b8ea70e62798af82b5a1d2';
const TERRI_NITR0_NODE = 'b83b7b3c559e1aa636391dadda9fc60ba330cddc';
interface ITerriTransaction extends IBaseTransaction {
  $territoriality: string;
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

  transferNft: async (
    verifiedNft: IVerifyNftResponse,
    newOwnerIdentity: string,
    otk: FullOtk
  ): Promise<string> => {
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

    const signerOtk = { ...otk, identity: verifiedNft.nftAcnsStreamId };
    // Sign Transaction & Send
    const txHandler = new TransactionHandler();
    return makeTxSafe(await txHandler.signTransaction(txBody, signerOtk));
  },

  acnsRecord: async (
    otk: FullOtk,
    acnsStreamId: string,
    recordType: string,
    recordKey: string,
    value: string | null
  ): Promise<string> => {
    const txBody: IBaseTransaction = {
      $sigs: {},
      $tx: {
        $namespace: Nitr0gen.NFTNamespace,
        $contract: Nitr0gen.NFTAcnsRecord,
        $i: {
          nft: {
            $stream: acnsStreamId,
            recordType: recordType,
            recordName: recordKey,
            recordValue: value,
          },
        },
      },
    };
    const signerOtk = { ...otk, identity: acnsStreamId };

    // Sign Transaction & Send
    const txHandler = new TransactionHandler();
    return makeTxSafe(await txHandler.signTransaction(txBody, signerOtk));
  },

  L2Transaction: async (
    details: ITransactionVerifyResponse,
    otk: FullOtk
  ): Promise<string> => {
    const { amount, coinSymbol, tokenSymbol, internalFee } = details;

    // Convert fees and turn into one
    const internalDepositFee = BigInt(
      convertToFromDecimals(
        internalFee?.deposit ?? '0',
        coinSymbol,
        'to',
        tokenSymbol
      )
    );
    const internalWithdrawFee = BigInt(
      convertToFromDecimals(
        internalFee?.withdraw ?? '0',
        coinSymbol,
        'to',
        tokenSymbol
      )
    );
    const totalInternalFee = (
      internalWithdrawFee + internalDepositFee
    ).toString();
    const $i = {
      owner: {
        $stream: otk.identity,
        network: details.coinSymbol,
        token: details.tokenSymbol ?? nitr0genNativeCoin,
        amount: convertToFromDecimals(
          amount,
          coinSymbol,
          'to',
          tokenSymbol
        ).toString(),
        fee: { fixed: totalInternalFee },
      },
    };

    const txBody: IBaseTransaction = {
      $tx: {
        $namespace: Nitr0gen.Namespace,
        $contract: Nitr0gen.CryptoTransfer,
        $entry: 'transfer',
        $i,
        $o: {
          feeto: { $stream: AP_FEE_IDENTITY },
          to: { $stream: details.toAddress },
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
   * Generate signature for L1 transaction from Nitr0gen where wallet has funds registered to L2
   * @param sendersRootKey If a non-root owner is sending L1, need a ledgerId of a key on the same network owned as root by the sender
   */
  L2ToL1SignTransaction: async (
    transactions: ITransactionVerifyResponse,
    otk: FullOtk
  ): Promise<string> => {
    const {
      amount,
      txSignature,
      internalFee,
      keyLedgerId,
      coinSymbol,
      tokenSymbol,
    } = transactions;

    const convertedAmount = convertToFromDecimals(
      amount,
      coinSymbol,
      'to',
      tokenSymbol
    ).toString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txDetail: any = {
      amount: convertedAmount,
    };

    if (!txSignature) throw Error(`Unable to find txSignature`);
    // Used by Tron transactions
    if ('hex' in txSignature) {
      txDetail['hex'] = txSignature.hex;
    }

    // Used by ETH/BNB transactions
    if ('nonce' in txSignature) {
      txDetail['nonce'] = txSignature.nonce;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $o: any = {};

    const fee = {
      fixed: (internalFee?.withdraw
        ? BigInt(
            convertToFromDecimals(
              internalFee.withdraw,
              coinSymbol,
              'to',
              tokenSymbol
            )
          )
        : BigInt(0)
      ).toString(),
    };
    if (fee) {
      $o['feeto'] = { $stream: AP_FEE_IDENTITY };
    }

    if (!keyLedgerId) throw Error(`Unable to find keyLedgerId`);
    $o[keyLedgerId] = txDetail;

    const txBody: ITerriTransaction = {
      $territoriality: TERRI_NITR0_NODE,
      $tx: {
        $namespace: Nitr0gen.Namespace,
        $contract: Nitr0gen.CryptoTransfer,
        $entry: 'sign',
        $i: {
          owner: {
            $stream: otk.identity,
            network: coinSymbol,
            token: tokenSymbol ?? nitr0genNativeCoin,
            amount: convertedAmount,
            fee,
            // TODO: complete once 2FA is available
            // twoFa: "",
            signtx: txSignature,
          },
        },
        $o,
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
