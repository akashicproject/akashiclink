import {
  CoinSymbol,
  CryptoCurrencySymbol,
  TransactionLayer,
  TransactionStatus,
} from '@helium-pay/backend';
import type { Meta, StoryObj } from '@storybook/react';

import { TransactionHistoryListItem } from '../../../src/components/activity/transaction-history-list-item';
import { formatTransfers } from '../../../src/utils/formatTransfers';

const meta: Meta<typeof TransactionHistoryListItem> = {
  title: 'Components/Activity',
  component: TransactionHistoryListItem,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      table: {
        disable: true,
      },
    },
  },
  args: {
    showDetail: false,
    hasHoverEffect: false,
    divider: false,
  },
};

export default meta;
type Story = StoryObj<typeof TransactionHistoryListItem>;

const baseTransaction = {
  fromAddress: '0xC11f17B10791675fDFBf6E6C1Fde4c5B7Be0e195',
  toAddress: '0xa900365635a4e3ACE87d730C1eFDFffA7A3e81D1',
  amount: '0.010000',
  date: new Date(),
  initiatedAt: new Date(),
  status: TransactionStatus.CONFIRMED,
  layer: TransactionLayer.L1,
  coinSymbol: CoinSymbol.Tron_Nile,
} as const;

export const TronTransaction: Story = {
  args: {
    transfer: formatTransfers([
      {
        ...baseTransaction,
        coinSymbol: CoinSymbol.Tron_Nile,
      },
    ])[0],
  },
};

export const EthereumTransaction: Story = {
  args: {
    transfer: formatTransfers([
      {
        ...baseTransaction,
        coinSymbol: CoinSymbol.Ethereum_Mainnet,
      },
    ])[0],
  },
};

export const USDTTransaction: Story = {
  args: {
    transfer: formatTransfers([
      {
        ...baseTransaction,
        tokenSymbol: CryptoCurrencySymbol.USDT,
        coinSymbol: CoinSymbol.Ethereum_Mainnet,
      },
    ])[0],
  },
};

export const Layer2Transaction: Story = {
  args: {
    transfer: formatTransfers([
      {
        ...baseTransaction,
        coinSymbol: CoinSymbol.Ethereum_Mainnet,
        layer: TransactionLayer.L2,
      },
    ])[0],
  },
};

export const TransactionWithDetails: Story = {
  args: {
    transfer: formatTransfers([baseTransaction])[0],
    hasHoverEffect: true,
    showDetail: true,
  },
};
