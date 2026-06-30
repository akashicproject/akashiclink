import { TransactionStatus } from '@akashic/as-backend';
import { CoinSymbol, CryptoCurrencySymbol } from '@akashic/core-lib';
import { TransactionLayer } from '@akashic/nitr0gen';
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

const now = new Date();

const baseTransaction = {
  fromAddress: 'TVBAa5Wr9XTuho66qY3vLS32kNnZyMw5md',
  toAddress: 'TG4BTSPRV3iANo8tgVfdtMVDjMLFEZUWYP',
  amount: '0.010000',
  usdtValue: 0.01,
  date: now,
  initiatedAt: now,
  createdAt: now,
  updatedAt: now,
  status: TransactionStatus.CONFIRMED,
  layer: TransactionLayer.L1,
  coinSymbol: CoinSymbol.Tron_Shasta,
} as const;

export const TronTransaction: Story = {
  args: {
    transfer: formatTransfers([
      {
        ...baseTransaction,
        coinSymbol: CoinSymbol.Tron_Shasta,
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
