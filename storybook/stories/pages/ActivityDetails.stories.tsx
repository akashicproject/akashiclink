import {
  generateMockTxnWithCurrency,
  mockGetOwnerDetails,
} from '@helium-pay/api-mocks';
import { IonReactMemoryRouter } from '@ionic/react-router';
import type { Meta, StoryObj } from '@storybook/react/*';
import { createMemoryHistory } from 'history';

import { ActivityDetails } from '../../../src/pages/activity/activity-details';

const history = createMemoryHistory({
  initialEntries: [
    {
      state: {
        activityDetails: { currentTransfer: generateMockTxnWithCurrency({}) },
      },
    },
  ],
});

const meta: Meta<typeof ActivityDetails> = {
  title: 'Pages/Activity',
  component: ActivityDetails,
  decorators: [
    (Story) => (
      <IonReactMemoryRouter history={history}>
        <Story />
      </IonReactMemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityDetails>;

export const ActivityDetailsPage: Story = {
  name: 'Activity Details Page',
  parameters: {
    msw: {
      handlers: {
        owner: mockGetOwnerDetails,
      },
    },
  },
};
