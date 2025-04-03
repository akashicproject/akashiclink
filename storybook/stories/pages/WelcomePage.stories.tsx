import type { Meta, StoryObj } from '@storybook/react';

import { AkashicPayMain } from '../../../src/pages/akashic-main';

const meta: Meta<typeof AkashicPayMain> = {
  title: 'Pages',
  component: AkashicPayMain,
  args: {
    isPopup: false,
  },
  parameters: {
    hasLocalAccounts: false,
    isLoggedIn: false,
  },
};

export default meta;
type Story = StoryObj<typeof AkashicPayMain>;

export const WelcomePage: Story = {};
