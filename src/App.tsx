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

import { Preferences } from '@capacitor/preferences';
import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactMemoryRouter } from '@ionic/react-router';
import { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

import { useAppSelector } from './app/hooks';
import type { RootState } from './app/store';
import VersionUpdateAlert from './components/layout/version-update-alert';
import { useLogout } from './components/logout';
import { PreferenceProvider } from './components/PreferenceProvider';
import { history } from './history';
import { NavigationTree } from './routing/navigation-tree';

setupIonicReact();

// eslint-disable-next-line import/no-default-export
export default function App() {
  const lastLocation = useAppSelector(
    (state: RootState) => state?.router?.location
  );
  const logout = useLogout();

  useIdleTimer({
    onIdle: () => logout(),
    // TODO
    // Move this to preference and store in local storage
    timeout: 10 * 60 * 1000,
    throttle: 500,
  });

  useEffect(() => {
    const cacheLastLocation = async () => {
      // below indicates an event of opening a soft closed app
      if (lastLocation && lastLocation.pathname !== history.location.pathname) {
        // saving the last location to the local storage
        // so that akashic-main.tsx can redirect to it
        await Preferences.set({
          key: 'lastLocation',
          value: JSON.stringify(lastLocation),
        });
      }
    };
    cacheLastLocation();
  }, [lastLocation.pathname]);

  return (
    <IonApp>
      <PreferenceProvider>
        <IonReactMemoryRouter history={history}>
          <NavigationTree />
        </IonReactMemoryRouter>
      </PreferenceProvider>
      {process.env.REACT_APP_SKIP_UPDATE_CHECK !== 'true' && (
        <VersionUpdateAlert />
      )}
    </IonApp>
  );
}
