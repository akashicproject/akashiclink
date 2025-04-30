import { Preferences } from '@capacitor/preferences';
import { IonContent, IonFooter, IonPage } from '@ionic/react';
import { type ReactNode, useEffect } from 'react';

import { LAST_HISTORY_ENTRIES } from '../../constants';
import { history } from '../../routing/history';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { DepositModalContextProvider } from '../deposit/deposit-modal-context-provider';
import { Header } from '../layout/header';
import { NavigationTabs } from '../layout/navigation-tabs';
import { VersionUpdateAlert } from '../layout/version-update-alert';
import { SendFormContextProvider } from '../send/send-modal-context-provider';

export function DashboardLayout({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { authenticated } = useAccountStorage();

  /** If user auth has expired, redirect to login page */
  useEffect(() => {
    const updateLastLocation = async () => {
      if (!authenticated) {
        await Preferences.remove({
          key: LAST_HISTORY_ENTRIES,
        });
      } else {
        await Preferences.set({
          key: LAST_HISTORY_ENTRIES,
          value: JSON.stringify(history.entries),
        });
      }
    };

    updateLastLocation();
  }, [authenticated, history]);

  return (
    <IonPage>
      <DepositModalContextProvider>
        <SendFormContextProvider>
          <Header />
          <IonContent>{children}</IonContent>
          {footer && <IonFooter class={'ion-no-border'}>{footer}</IonFooter>}
          {process.env.REACT_APP_SKIP_UPDATE_CHECK !== 'true' && (
            <VersionUpdateAlert />
          )}
          <NavigationTabs />
        </SendFormContextProvider>
      </DepositModalContextProvider>
    </IonPage>
  );
}
