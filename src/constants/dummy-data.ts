import { CoinSymbol } from '@helium-pay/backend/src/modules/api-interfaces/coin-symbol.model';
import type { IOwnerBalancesResponse } from '@helium-pay/backend/src/modules/api-interfaces/owner/owner-response.interface';
import { TransactionLayer } from '@helium-pay/backend/src/modules/api-interfaces/transactions/transaction-layer';
import type { ITransactionRecord } from '@helium-pay/backend/src/modules/api-interfaces/transactions/transaction-records.interface';
import { TransactionStatus } from '@helium-pay/backend/src/modules/keys/models/transaction-status.model';

export enum K {
  key1 = 'AAx111111',
  key2 = 'BBx222222',
  key3 = 'CCx333333',
}

export const txns: { [key: string]: ITransactionRecord[] } = {
  [K.key1]: [
    {
      date: new Date('2022-10-01'),
      fromAddress: K.key1,
      toAddress: 'FFx666666',
      coinSymbol: CoinSymbol.Bitcoin,
      amount: '100',
      status: TransactionStatus.PENDING,
      txHash: '0x1',
      ownerAddress: K.key1,
      layer: TransactionLayer.L1,
    },
    {
      date: new Date('2022-12-01'),
      fromAddress: K.key1,
      toAddress: 'GGx7777777',
      coinSymbol: CoinSymbol.Ethereum_Mainnet,
      amount: '22',
      status: TransactionStatus.CONFIRMED,
      txHash: '0x2',
      ownerAddress: K.key1,
      layer: TransactionLayer.L1,
    },
    {
      date: new Date('2022-12-23'),
      fromAddress: 'HHx88888888',
      toAddress: K.key1,
      coinSymbol: CoinSymbol.Ethereum_Mainnet,
      tokenSymbol: 'USDT',
      amount: '1',
      status: TransactionStatus.CONFIRMED,
      txHash: '0x3',
      ownerAddress: K.key1,
      layer: TransactionLayer.L1,
    },
  ],
  [K.key2]: [],
  [K.key3]: [],
};

export type Wallet = Omit<IOwnerBalancesResponse, 'balance'> & {
  balance?: string;
  address?: string;
  gasFreeAvailable?: boolean;
};

export type AggregatedWalletBalances = {
  [key: string]: Wallet[];
};

export const availableNames = ['Name 1', 'Name 2', 'Fancy Name'];

export const KeyPair = 'AAx2222222222226gscw33568tnjdffdb0000gfcMcd5';

/**
 * Dummy balance data we will recieve for each key
 * If `balance` is not given, the wallet is "inactive"
 */
export const aggregatedWalletBalances: AggregatedWalletBalances = {
  [K.key1]: [
    {
      coinSymbol: CoinSymbol.Bitcoin,
    },
    {
      coinSymbol: CoinSymbol.Tron,
    },
    {
      coinSymbol: CoinSymbol.Ethereum_Mainnet,
      tokenSymbol: 'USDT',
      balance: '0.2',
    },
    {
      coinSymbol: CoinSymbol.Ethereum_Mainnet,
      balance: '0.1',
      gasFreeAvailable: true,
    },
  ],
  [K.key2]: [
    {
      coinSymbol: CoinSymbol.Bitcoin,
      balance: '0',
    },
    {
      coinSymbol: CoinSymbol.Ethereum_Mainnet,
      tokenSymbol: 'USDT',
      balance: '0',
    },
    {
      coinSymbol: CoinSymbol.Ethereum_Mainnet,
      balance: '0',
    },
  ],
  [K.key3]: [
    {
      coinSymbol: CoinSymbol.Bitcoin,
      balance: '0',
    },
    {
      coinSymbol: CoinSymbol.Ethereum_Mainnet,
      balance: '0',
    },
  ],
};
