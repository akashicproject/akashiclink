import type { Meta, StoryObj } from '@storybook/react';
import { withReactContext } from 'storybook-react-context';

import {
  ActiveAccountContext,
  LocalAccountContext,
} from '../../../src/components/providers/PreferenceProvider';
import { urls } from '../../../src/constants/urls';
import { Dashboard as DashboardComponent } from '../../../src/pages/dashboard/dashboard';
import { akashicPayPath } from '../../../src/routing/navigation-tabs';
import type { LocalAccount } from '../../../src/utils/hooks/useLocalAccounts';
import { withMockPath } from '../../utils/mock-path';

const meta: Meta<typeof DashboardComponent> = {
  title: 'Pages',
  component: DashboardComponent,
  decorators: [withMockPath(akashicPayPath(urls.dashboard))],
};

export default meta;
type Story = StoryObj<typeof DashboardComponent>;

export const Dashboard: Story = {
  decorators: [
    withReactContext({
      Context: LocalAccountContext,
      initialState: {
        localAccounts: [
          {
            identity: 'mock-1',
            username: 'mock-user-1',
          },
          {
            identity: 'mock-2',
            username: 'mock-user-2',
          },
        ],
      },
    }),
    withReactContext({
      Context: ActiveAccountContext,
      initialState: {
        activeAccount: {
          identity: 'mock-1',
          username: 'mock-user-1',
        },
        // TODO: Make this do something or delete
        setActiveAccount: (localAcc: LocalAccount) => {
          return localAcc;
        },
      },
    }),
  ],
};
