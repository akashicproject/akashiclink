import type { Meta, StoryObj } from '@storybook/react';

import { AddressScreeningHistory } from '../../../src/pages/address-screening/address-screening-history';

const meta: Meta<typeof AddressScreeningHistory> = {
  title: 'Pages/Address Screening',
  component: AddressScreeningHistory,
};

export default meta;
type Story = StoryObj<typeof AddressScreeningHistory>;

export const AddressScreeningPage: Story = {
  name: 'Address Screening Page',
};
