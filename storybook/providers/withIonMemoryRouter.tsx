import { IonApp } from '@ionic/react';
import { IonReactMemoryRouter } from '@ionic/react-router';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

export const withIonMemoryRouter = (Story: any) => {
  return (
    <IonApp>
      <IonReactMemoryRouter history={history}>
        <Story />
      </IonReactMemoryRouter>
    </IonApp>
  );
};
