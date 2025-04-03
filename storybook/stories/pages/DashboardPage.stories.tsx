import {
  mockGetNftOwner,
  mockGetNftOwnerTransfers,
  mockGetOwnerDetails,
  mockGetOwnerTransactions,
} from '@helium-pay/api-mocks';
import type { Meta, StoryObj } from '@storybook/react';

import { Dashboard } from '../../../src/pages/dashboard/dashboard';

const meta: Meta<typeof Dashboard> = {
  title: 'Pages',
  component: Dashboard,
  args: {
    isPopup: false,
  },
  parameters: {
    msw: {
      handlers: {
        owner: mockGetOwnerDetails,
        nft: mockGetNftOwner,
        transactions: mockGetOwnerTransactions,
        nftTransfer: mockGetNftOwnerTransfers,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const DashboardPage: Story = {};
