import type {
  INftTransactionRecord,
  ITransactionRecord,
  ITransactionRecordForFrontend,
  TransactionType,
} from '@helium-pay/backend';
import {
  formatNftTransactionForFrontend,
  formatTransactionForFrontend,
  NetworkDictionary,
  TransactionLayer,
} from '@helium-pay/backend';

import type { IWalletCurrency } from '../constants/currencies';
import { makeWalletCurrency } from '../constants/currencies';

const akashicScanAccountsUrl = `${process.env.REACT_APP_SCAN_BASE_URL}/accounts`;
const akashicScanTransactionsUrl = `${process.env.REACT_APP_SCAN_BASE_URL}/transactions`;
export interface ITransactionRecordForExtension
  extends ITransactionRecordForFrontend {
  networkIcon?: string;
  currency?: IWalletCurrency;
  l2TxnHashUrl: string;
}

/**
 * Formats transfer records fetched from backend, separated by nft and crypto transactions
 *
 * @param transfers fetched from backend
 */
export function formatTransfers(transfers: ITransactionRecord[]) {
  const formattedTransfers = transfers.map(
    (t, id): ITransactionRecordForExtension => {
      const l2Sender =
        t?.layer === TransactionLayer.L2
          ? t.fromAddress
          : t.senderInfo?.identity;

      const l2Receiver =
        t?.layer === TransactionLayer.L2
          ? t.toAddress
          : t.receiverInfo?.identity;
      return {
        ...formatTransactionForFrontend(t, id),
        networkIcon: NetworkDictionary[t.coinSymbol].networkIcon,
        currency: makeWalletCurrency(t.coinSymbol, t?.tokenSymbol),
        internalSenderUrl: l2Sender
          ? `${akashicScanAccountsUrl}/${l2Sender}`
          : undefined, // Keep undefined so we can default to L1 URL if there is no L2 URL
        internalRecipientUrl: l2Receiver
          ? `${akashicScanAccountsUrl}/${l2Receiver}`
          : undefined,
        l2TxnHashUrl: `${akashicScanTransactionsUrl}/${t?.l2TxnHash ?? ''}`,
      };
    }
  );

  formattedTransfers.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return formattedTransfers;
}

export function formatNftTransfers(transfers: INftTransactionRecord[]) {
  const formattedTransfers = transfers.map(
    (t, id): ITransactionRecordForExtension => ({
      ...formatNftTransactionForFrontend(t, id),
      internalSenderUrl: `${akashicScanAccountsUrl}/${t.fromAddress}`,
      internalRecipientUrl: `${akashicScanAccountsUrl}/${t.toAddress}`,
    })
  );

  formattedTransfers.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return formattedTransfers;
}

export function formatMergeAndSortNftAndCryptoTransfers(
  transfers: ITransactionRecord[],
  nftTransfers: INftTransactionRecord[],
  filters?: {
    layer?: TransactionLayer;
    transferType?: TransactionType;
    txnType: ('currency' | 'nft')[];
    currency?: IWalletCurrency;
  }
) {
  const allFormattedTransfers = formatTransfers(
    !filters || filters?.txnType?.includes('currency') ? transfers : []
  ).concat(
    formatNftTransfers(
      !filters || filters?.txnType?.includes('nft') ? nftTransfers : []
    )
  );

  allFormattedTransfers.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const filteredTransfers = allFormattedTransfers.filter(
    (txn) =>
      (!filters?.layer || txn.layer === filters.layer) &&
      (!filters?.transferType || txn.transferType === filters.transferType) &&
      (!filters?.currency ||
        `${txn.currency?.chain}-${txn.currency?.token ?? ''}` ===
          `${filters.currency?.chain}-${filters.currency?.token ?? ''}`)
  );

  return filteredTransfers;
}
