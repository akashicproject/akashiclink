import type { Meta, StoryObj } from '@storybook/react';
import { withReactContext } from 'storybook-react-context';

import { LocalAccountContext } from '../../../src/components/PreferenceProvider';
import { AkashicPayMain } from '../../../src/pages/akashic-main';
import { akashicPayRoot } from '../../../src/routing/navigation-tabs';
import { ownerUnauthorised } from '../../mocks/owner';
import { withMockPath } from '../../utils/mock-path';

const meta: Meta<typeof AkashicPayMain> = {
  title: 'Pages/Landing Page',
  component: AkashicPayMain,
  parameters: {
    msw: {
      handlers: {
        auth: [ownerUnauthorised],
      },
    },
  },
  decorators: [withMockPath(akashicPayRoot)],
};

export default meta;
type Story = StoryObj<typeof AkashicPayMain>;

export const NewUser: Story = {};

export const ReturningUser: Story = {
  decorators: [
    withReactContext({
      Context: LocalAccountContext,
      initialState: {
        localAccounts: [
          {
            identity: 'mock-identity',
            username: 'mock-username',
          },
        ],
        setLocalAccounts: () => console.warn('setLocalAccounts not ready'),
      },
    }),
  ],
};
