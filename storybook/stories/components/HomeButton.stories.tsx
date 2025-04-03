import type { Meta, StoryObj } from '@storybook/react';

import { HomeButton } from '../../../src/components/home-button';

const meta: Meta<typeof HomeButton> = {
  title: 'Components/Buttons',
  component: HomeButton,
};

export default meta;
type Story = StoryObj<typeof HomeButton>;

export const Home: Story = {};
