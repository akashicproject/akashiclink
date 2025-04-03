/**
 * Test data using for manual testing and show-casing features while the wallet extension is not connected to the backend
 * TODO: remove once not needed or transform into tests
 */

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
 * Dummy balance data we will receive for each key
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

export const transfersDate = [
  {
    date: new Date('2023-01-03T15:02:15.000Z'),
    fromAddress: 'TC8osxQSF1VKqM3RhzWHXJsP1UGuZspLbA',
    toAddress: 'TErL7RMwuJ9h4BjysHbRYMUnDQUpEvP5fZ',
    coinSymbol: 'TRX-NILE',
    tokenSymbol: 'USDT',
    amount: '1000.000000',
    status: 'Confirmed',
    result: 'Failure',
    txHash: '03e73cd51bf44fe564bac83bdf4a8dfc0385ce0b346e701a958c9b83747c3b1c',
    feesPaid: '0.632940',
    ownerAddress: 'TC8osxQSF1VKqM3RhzWHXJsP1UGuZspLbA',
  },
  {
    date: new Date('2023-01-03T15:03:15.000Z'),
    fromAddress: 'TTG8u8fUKqJwMtB59ppaWqgFVGDb5ojWPU',
    toAddress: 'TBvsCdBEMEU6RAuQXfqHMPW7vJDxBPghrZ',
    coinSymbol: 'TRX-NILE',
    amount: '2000.000000',
    status: 'Confirmed',
    result: 'Success',
    txHash: '3b0ed1d733dbbc921f6c8f57c6c3e62e920dcaa2c2b88d68bb17a07582501d93',
    feesPaid: '0.100000',
    ownerAddress: 'TBvsCdBEMEU6RAuQXfqHMPW7vJDxBPghrZ',
  },
  {
    date: new Date('2023-01-03T15:04:15.000Z'),
    fromAddress: '0xa900365635a4e3ace87d730c1efdfffa7a3e81d1',
    toAddress: '0xc11f17b10791675fdfbf6e6c1fde4c5b7be0e195',
    coinSymbol: 'tBNB',
    tokenSymbol: 'BUSD',
    amount: '0.00000100001',
    status: 'Confirmed',
    result: 'Success',
    txHash:
      '0xdbf1bd1e73f49ec25529926025e96f6a77a4634e6f88f3069713b5d443b625d9',
    feesPaid: '0.001088829000000000',
    ownerAddress: '0xa900365635a4e3ACE87d730C1eFDFffA7A3e81D1',
  },
  {
    date: new Date('2023-01-03T15:05:15.000Z'),
    fromAddress: '0xa900365635a4e3ace87d730c1efdfffa7a3e81d1',
    toAddress: '0xc11f17b10791675fdfbf6e6c1fde4c5b7be0e195',
    coinSymbol: 'tBNB',
    tokenSymbol: 'USDC',
    amount: '0.0000012',
    status: 'Confirmed',
    result: 'Success',
    txHash:
      '0xc2199084338619343c5220c5a2ddc6ee858e42e5efa7cd97e08be72cdb555ea0',
    feesPaid: '0.000974133000000000',
    ownerAddress: '0xa900365635a4e3ACE87d730C1eFDFffA7A3e81D1',
  },
  {
    date: new Date('2023-01-03T15:06:15.000Z'),
    fromAddress: '0xc11f17b10791675fdfbf6e6c1fde4c5b7be0e195',
    toAddress: '0xa900365635a4e3ace87d730c1efdfffa7a3e81d1',
    coinSymbol: 'tBNB',
    tokenSymbol: 'USDC',
    amount: '10000000000.1',
    status: 'Confirmed',
    result: 'Failure',
    txHash:
      '0x3a24483b8f9bc48531d5a1381f040afae629e1e747d661420ab91828d1ab924b',
    feesPaid: '0.000634932000000000',
    ownerAddress: '0xC11f17B10791675fDFBf6E6C1Fde4c5B7Be0e195',
  },
  {
    date: new Date('2023-01-03T15:07:15.000Z'),
    fromAddress: '0xa900365635a4e3ace87d730c1efdfffa7a3e81d1',
    toAddress: '0xc11f17b10791675fdfbf6e6c1fde4c5b7be0e195',
    coinSymbol: 'tBNB',
    amount: '0.0000010003',
    status: 'Confirmed',
    result: 'Success',
    txHash:
      '0xdc5cc55b771ff794dadbcb9dc8f449084c3c1b606bb818fc20680151b92f55aa',
    feesPaid: '0.000567000000000000',
    ownerAddress: '0xC11f17B10791675fDFBf6E6C1Fde4c5B7Be0e195',
  },
  {
    date: new Date('2023-01-03T15:08:15.000Z'),
    fromAddress: '0x352ad0b65ccaaddd2c3e3b1a78be555171c239f3',
    toAddress: '0xe94f9ce88501e57353ab2c31b1f3b47429c92b21',
    coinSymbol: 'GOR',
    tokenSymbol: 'USDC',
    amount: '100000000',
    status: 'Confirmed',
    result: 'Failure',
    txHash:
      '0x0dea6184634ae491997e2ce8d54ec295ff249a5848aac2c2491c7272834a58a8',
    feesPaid: '0.000191743406329939',
    ownerAddress: '0x352aD0b65ccaaDDd2c3E3B1a78be555171c239f3',
  },
  {
    date: new Date('2023-01-03T15:09:15.000Z'),
    fromAddress: '0x352ad0b65ccaaddd2c3e3b1a78be555171c239f3',
    toAddress: '0xe94f9ce88501e57353ab2c31b1f3b47429c92b21',
    coinSymbol: 'GOR',
    amount: '0.00000100004',
    status: 'Confirmed',
    result: 'Success',
    txHash:
      '0x62ad3aa5500ccddd35b9730007a7daeffc004c25e31227b83e4bb828629caaa1',
    feesPaid: '0.000062530428807000',
    ownerAddress: '0x352aD0b65ccaaDDd2c3E3B1a78be555171c239f3',
  },
  {
    date: new Date('2023-01-03T15:20:15.000Z'),
    fromAddress: '0x352ad0b65ccaaddd2c3e3b1a78be555171c239f3',
    toAddress: '0xe94f9ce88501e57353ab2c31b1f3b47429c92b21',
    coinSymbol: 'GOR',
    tokenSymbol: 'USDT',
    amount: '0.00000105',
    status: 'Confirmed',
    result: 'Success',
    txHash:
      '0x271a6dc5402ef699eb19774b783f3c65feccb06176280cbd40b40b97ec771790',
    feesPaid: '0.000107775777450861',
    ownerAddress: '0x352aD0b65ccaaDDd2c3E3B1a78be555171c239f3',
  },
  {
    date: new Date('2023-01-03T15:21:15.000Z'),
    fromAddress: '0x352ad0b65ccaaddd2c3e3b1a78be555171c239f3',
    toAddress: '0xe94f9ce88501e57353ab2c31b1f3b47429c92b21',
    coinSymbol: 'GOR',
    tokenSymbol: 'USDC',
    amount: '0.000001',
    status: 'Confirmed',
    result: 'Success',
    txHash:
      '0x4310c1e9cefafdb7063664667dff9074155ff24934f018ad87066accf1a6e4bd',
    feesPaid: '0.000120978152465529',
    ownerAddress: '0x352aD0b65ccaaDDd2c3E3B1a78be555171c239f3',
  },
  {
    date: new Date('2023-01-03T15:22:15.000Z'),
    senderAddress: '0x352ad0b65ccaaddd2c3e3b1a78be555171c239f3',
    toAddress: '0xe94f9ce88501e57353ab2c31b1f3b47429c92b21',
    coinSymbol: 'GOR',
    amount: '0.000001000000000000',
    status: 'Confirmed',
    result: 'Success',
    txHash:
      '0x62ad3aa5500ccddd35b9730007a7daeffc004c25e31227b83e4bb828629caaa1',
    feesPaid: '0.000062530428807000',
    ownerAddress: '0xE94F9Ce88501e57353ab2C31B1f3b47429c92B21',
  },
];
