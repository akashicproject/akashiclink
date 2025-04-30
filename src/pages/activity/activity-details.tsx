import styled from '@emotion/styled';
import { useHistory } from 'react-router-dom';

import { NftDetail } from '../../components/activity/nft-details';
import { TransactionDetails } from '../../components/activity/transactions-details';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import type { LocationState } from '../../routing/history';

export const ActivityContainer = styled.div({
  position: 'relative',
  margin: '0 auto',
  padding: '4px 24px',
});

export const ActivityDetails = () => {
  const history = useHistory<LocationState>();
  const transfer = history.location.state?.activityDetails?.currentTransfer;

  if (!transfer) {
    return <></>;
  }

  return (
    <DashboardLayout>
      {transfer.nft ? (
        <NftDetail currentTransfer={transfer} />
      ) : (
        <TransactionDetails currentTransfer={transfer} />
      )}
    </DashboardLayout>
  );
};
