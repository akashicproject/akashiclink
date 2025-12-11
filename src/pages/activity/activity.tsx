import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { TransactionHistoryList } from '../../components/activity/transaction-history-list';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';

export function Activity() {
  return (
    <DashboardLayout>
      <IonGrid>
        <IonRow>
          <IonCol size="12">
            <TransactionHistoryList isFilterType isFilterNFT />
          </IonCol>
        </IonRow>
      </IonGrid>
    </DashboardLayout>
  );
}
