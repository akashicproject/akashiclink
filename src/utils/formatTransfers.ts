import type {
  ITransactionRecord,
  ITransactionRecordForFrontend,
} from '@helium-pay/backend';
import {
  formatTransactionForFrontend,
  NetworkDictionary,
} from '@helium-pay/backend';

import type { IWalletCurrency } from '../constants/currencies';
import { makeWalletCurrency } from '../constants/currencies';

export interface ITransactionRecordForExtension
  extends ITransactionRecordForFrontend {
  networkIcon: string;
  currency: IWalletCurrency;
}

/**
 * Formats transfer records fetched from backend
 *
 * @param transfers fetched from backend
 */
export function formatTransfers(transfers: ITransactionRecord[]) {
  const formattedTransfers = transfers.map(
    (t, id): ITransactionRecordForExtension => ({
      ...formatTransactionForFrontend(t, id),
      networkIcon: NetworkDictionary[t.coinSymbol].networkIcon,
      currency: makeWalletCurrency(t.coinSymbol, t.tokenSymbol),
    })
  );

  formattedTransfers.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return formattedTransfers;
}
