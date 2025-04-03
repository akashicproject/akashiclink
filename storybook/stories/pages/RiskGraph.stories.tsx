import { RiskLevel } from '@helium-pay/backend';
import type { Meta, StoryObj } from '@storybook/react';

import { RiskGraph } from '../../../src/components/common/risk-graph';

const meta: Meta<typeof RiskGraph> = {
  title: 'Components/RiskGraph',
  component: RiskGraph,
  argTypes: {
    riskLevel: {
      control: 'select',
      options: [
        RiskLevel.LOW,
        RiskLevel.MODERATE,
        RiskLevel.HIGH,
        RiskLevel.SEVERE,
      ],
      defaultValue: 'high',
    },
    detailList: {
      control: 'object',
      defaultValue: [
        'Malicious Address',
        'Medium-risk Tag Address',
        'Interact With Malicious Address',
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RiskGraph>;

export const LowRisk: Story = {
  args: {
    riskLevel: RiskLevel.LOW,
    detailList: ['Malicious Address'],
  },
};

export const ModerateRisk: Story = {
  args: {
    riskLevel: RiskLevel.MODERATE,
    detailList: ['Medium-risk Tag Address'],
  },
};

export const HighRisk: Story = {
  args: {
    riskLevel: RiskLevel.HIGH,
    detailList: ['Interact With Malicious Address'],
  },
};

export const SevereRisk: Story = {
  args: {
    riskLevel: RiskLevel.SEVERE,
    detailList: ['Gambling'],
  },
};
