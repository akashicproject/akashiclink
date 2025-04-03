import type {
  INft,
  INftTransactionRecord,
  ITransactionRecord,
  ITransactionRecordForFrontend,
} from '@helium-pay/backend';
import {
  formatNftTransactionForFrontend,
  formatTransactionForFrontend,
  NetworkDictionary,
} from '@helium-pay/backend';

import type { IWalletCurrency } from '../constants/currencies';
import { makeWalletCurrency } from '../constants/currencies';

export interface ITransactionRecordForExtension
  extends ITransactionRecordForFrontend {
  networkIcon?: string;
  currency?: IWalletCurrency;
  nft?: INft;
  l2TxnHashUrl: string;
}

/**
 * Formats transfer records fetched from backend, separated by nft and crypto transactions
 *
 * @param transfers fetched from backend
 */
export function formatTransfers(transfers: ITransactionRecord[]) {
  const formattedTransfers = transfers.map(
    (t, id): ITransactionRecordForExtension => ({
      ...formatTransactionForFrontend(t, id),
      networkIcon: NetworkDictionary[t.coinSymbol].networkIcon,
      currency: makeWalletCurrency(t.coinSymbol, t?.tokenSymbol),
      l2TxnHashUrl: t?.l2TxnHash ?? '', // TODO: url will be added in hyperlink branch
    })
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
      l2TxnHashUrl: t.l2TxnHash, // TODO: Add url later
    })
  );

  formattedTransfers.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return formattedTransfers;
}

export function formatMergeAndSortNftAndCryptoTransfers(
  transfers: ITransactionRecord[],
  nftTransfers: INftTransactionRecord[]
) {
  const allFormattedTransfers = formatTransfers(transfers).concat(
    formatNftTransfers(nftTransfers)
  );

  allFormattedTransfers.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return allFormattedTransfers;
}
