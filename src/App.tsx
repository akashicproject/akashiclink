/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import './theme/font.css';
import './theme/common.scss';

import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router';

import { PreferenceProvider } from './components/PreferenceProvider';
import { NavigationTree } from './routing/navigation-tree';

setupIonicReact();

// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <IonApp>
      <PreferenceProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" component={NavigationTree} />
          </IonRouterOutlet>
        </IonReactRouter>
      </PreferenceProvider>
    </IonApp>
  );
}
