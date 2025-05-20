import { IonSpinner } from '@ionic/react';

import { TransactionHistoryList } from '../../components/activity/transaction-history-list';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { useMyTransfersInfinite } from '../../utils/hooks/useMyTransfersInfinite';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';

export function Activity() {
  const { isLoading } = useMyTransfersInfinite();
  const { isLoading: isLoadingNft } = useNftTransfersMe();

  const isDataLoaded = !isLoading && !isLoadingNft;

  return (
    <DashboardLayout showSwitchAccountBar showAddress showRefresh>
      {!isDataLoaded && (
        <IonSpinner
          color="primary"
          name="circular"
          class="force-center"
          style={{
            marginLeft: '50vw',
            marginTop: '50%',
            transform: 'translateX(-50%)',
            '--webkit-transform': 'translateX(-50%)',
          }}
        />
      )}
      <TransactionHistoryList
        isFilterLayer={true}
        isFilterType={true}
        isFilterNFT={true}
      />
    </DashboardLayout>
  );
}
