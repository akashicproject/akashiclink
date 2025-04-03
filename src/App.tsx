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

import VersionUpdateAlert from './components/layout/version-update-alert';
import { PreferenceProvider } from './components/providers/PreferenceProvider';
import { LAST_PAGE_LOCATION } from './constants';
import { useAppSelector } from './redux/app/hooks';
import type { RootState } from './redux/app/store';
import { history } from './routing/history';
import { NavigationTree } from './routing/navigation-tree';

setupIonicReact();

// eslint-disable-next-line import/no-default-export
export default function App() {
  const lastLocation = useAppSelector(
    (state: RootState) => state?.router?.location
  );
  useEffect(() => {
    const cacheLastLocation = async () => {
      // below indicates an event of opening a soft closed app
      if (lastLocation && lastLocation.pathname !== history.location.pathname) {
        // saving the last location to the local storage
        // so that akashic-main.tsx can redirect to it
        await Preferences.set({
          key: LAST_PAGE_LOCATION,
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
