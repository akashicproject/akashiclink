import { IonCol, IonContent, IonPage, IonRow } from '@ionic/react';
import type { ReactNode } from 'react';
import React, { useEffect } from 'react';

import { LAST_HISTORY_ENTRIES } from '../../constants';
import { history } from '../../routing/history';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { Header } from '../layout/header';
import { AccountNameBar } from '../layout/toolbar/account-name-bar';

export function NftLayout({
  children,
}: {
  children: ReactNode;
  backButton?: boolean;
  noFooter?: boolean;
  backButtonUrl?: string;
}) {
  const { setValue } = useLocalStorage(LAST_HISTORY_ENTRIES);

  useEffect(() => {
    const updateLastLocation = () => {
      setValue(history.entries);
    };

    updateLastLocation();
  }, [history.entries]);

  return (
    <IonPage style={{ maxWidth: 600, margin: '0 auto' }}>
      <Header />
      <IonContent className="nft-layout ion-text-align-center">
        <IonRow>
          <IonCol size="12" className="ion-no-padding">
            <AccountNameBar />
          </IonCol>
        </IonRow>
        {children}
      </IonContent>
    </IonPage>
  );
}
