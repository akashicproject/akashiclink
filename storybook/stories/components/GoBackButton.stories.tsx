import type { Meta, StoryObj } from '@storybook/react';

import { BackButton } from '../../../src/components/back-button';

const meta: Meta<typeof BackButton> = {
  title: 'Components/Buttons',
  component: BackButton,
};
export default meta;
type Story = StoryObj<typeof BackButton>;

export const GoBack: Story = {};
