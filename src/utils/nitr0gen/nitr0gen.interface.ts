/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CoinSymbol, CurrencySymbol } from '@helium-pay/backend';

/** ********* Internal Arguments/Responses ********* **/

export interface L2TxDetail {
  toAddress: string;
  coinSymbol: CoinSymbol;
  tokenSymbol?: CurrencySymbol;
  amount: string;
  initiatedToNonL2?: string;
}

export interface L1TxDetail {
  amount: string;
  nonce?: number;
}

export interface IOnboardedIdentity {
  ledgerId: string;
}

export interface ICreatedKey {
  ledgerId: string;
  address: string;
  hashes: string[];
}

/** ********* AC Responses ********* **/

/**
 * Generic ActiveLedger Response
 */
export interface ActiveLedgerResponse<T = any> {
  $umid: string;
  $summary: {
    total: number;
    vote: number;
    commit: number;
    // Sometimes omitted if there are no errors
    errors?: string[];
  };
  $streams: {
    new: any[];
    updated: any[];
  };
  $responses?: T[];
  $debug?: any;
}

export interface IKeyCreationResponse {
  id: string;
  address: string;
  hashes: string[];
}

/** ********* L1 Stuff ********* **/

/**
 * Nitr0gen Contract for signing ethereum coin and token transfers
 */
export interface Nitr0EthereumTrx {
  nonce: number;
  gas: string;
  contractAddress?: string;
}

/**
 * Nitr0gen contract for signing tron coin and token transfers
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Nitr0TronTrx {}

/**
 * Nitr0gen contract for signing btc transfers
 */

export type Nitr0Transaction = Nitr0EthereumTrx | Nitr0TronTrx;

export interface INewNitr0genKey {
  ledgerId: string;
  address: string;
  hashes: string[];
}
