import './logged.css';

import { IonCol, IonGrid, IonRow, IonSpinner } from '@ionic/react';
import type { ReactNode } from 'react';

import { ActivityAndNftTab } from '../../components/layout/activity-and-nft-tab';
import { LoggedLayout } from '../../components/layout/logged-layout';

export function LoggedMain({
  children,
  loading = false,
  isRefresh = false,
}: {
  children: ReactNode;
  loading?: boolean;
  isRefresh?: boolean;
}) {
  return (
    <LoggedLayout isRefresh={isRefresh}>
      {loading && (
        <IonGrid>
          <IonRow class="ion-justify-content-center ion-margin-vertical">
            <IonCol size="auto" class="ion-margin-vertical">
              <IonSpinner name="circular"></IonSpinner>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
      {!loading && children}
      <ActivityAndNftTab />
    </LoggedLayout>
  );
}
