import { IonApp } from '@ionic/react';
import { IonReactMemoryRouter } from '@ionic/react-router';
import type { StoryFn } from '@storybook/react';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

export const withIonMemoryRouter = (Story: StoryFn) => {
  return (
    <IonApp>
      <IonReactMemoryRouter history={history}>
        <Story />
      </IonReactMemoryRouter>
    </IonApp>
  );
};
