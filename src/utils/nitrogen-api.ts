import type { IBaseTransaction } from '@activeledger/sdk';
import { TransactionHandler } from '@activeledger/sdk';
import type {
  ITransactionVerifyResponse,
  IVerifyNftResponse,
} from '@helium-pay/backend';

import { convertToFromDecimals } from './currency';
import type { FullOtk } from './otk-generation';

enum Nitr0gen {
  Namespace = 'notabox.keys',
  NFTNamespace = 'candypig',
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
 * Class implements basic intereactions with the Nirt0gen network
 */
export const Nitr0genApi = {
  transferNft: async (
    verifiedNft: IVerifyNftResponse,
    newOwnerIdentity: string,
    otk: FullOtk
  ): Promise<string> => {
    const { phrase: _, ...object } = otk;
    const signerOtk: FullOtk = object;
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

    otk.identity = acnsStreamId;

    // Sign Transaction & Send
    const txHandler = new TransactionHandler();
    return makeTxSafe(await txHandler.signTransaction(txBody, otk));
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
