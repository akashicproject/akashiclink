import './activity.scss';

import styled from '@emotion/styled';
import { TransactionLayer } from '@helium-pay/backend';
import {
  IonBackdrop,
  IonButton,
  IonCard,
  IonIcon,
  IonImg,
  IonSpinner,
} from '@ionic/react';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { alertCircleOutline, closeOutline } from 'ionicons/icons';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { NftDetail } from '../../components/activity/nft-details';
import { OneActivity } from '../../components/activity/one-activity';
import { TransactionDetails } from '../../components/activity/transactions-details';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { formatMergeAndSortNftAndCryptoTransfers } from '../../utils/formatTransfers';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';

const L2Icon = '/shared-assets/images/PayLogo-all-white.svg';
export const Divider = styled.div<{
  borderColor?: string;
  height?: string;
  borderWidth?: string;
}>((props) => ({
  boxSizing: 'border-box',
  height: `${props.height || '2px'}`,
  border: `${props.borderWidth || '1px'} solid ${
    props.borderColor || '#D9D9D9'
  }`,
  width: '100%',
}));

const ListContainer = styled.div({
  paddingLeft: '8px',
  paddingRight: '8px',
}) as GridComponents['List'];

export const NoActivityWrapper = styled.div({
  width: '100%',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  marginTop: '200px',
});
export const NoActivityText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

export function Activity() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const [transferParams, _] = useState({
    startDate: dayjs().subtract(1, 'month').toDate(),
    hideSmallTransactions: true,
  });
  const { transfers, isLoading } = useTransfersMe(transferParams);
  const { transfers: nftTransfers, isLoading: isLoadingNft } =
    useNftTransfersMe(transferParams);
  const walletFormatTransfers = formatMergeAndSortNftAndCryptoTransfers(
    transfers,
    nftTransfers
  );
  return (
    <DashboardLayout showSetting={false}>
      {!isLoading && !isLoadingNft ? (
        walletFormatTransfers.length ? (
          <Virtuoso
            style={{
              margin: '20px 0px',
              minHeight: '60vh',
            }}
            data={walletFormatTransfers}
            components={{
              List: ListContainer,
            }}
            itemContent={(index, transfer) => (
              <OneActivity
                transfer={transfer}
                onClick={() => {
                  history.push({
                    pathname: akashicPayPath(urls.activityDetails),
                    state: {
                      activityDetails: {
                        currentTransfer: transfer,
                      },
                    },
                  });
                }}
                showDetail={true}
                hasHoverEffect={true}
                divider={index !== walletFormatTransfers.length - 1}
              />
            )}
          />
        ) : (
          <NoActivityWrapper>
            <IonIcon icon={alertCircleOutline} className="alert-icon" />
            <NoActivityText>{t('NoActivity')}</NoActivityText>
          </NoActivityWrapper>
        )
      ) : (
        <IonSpinner
          color="primary"
          name="circular"
          class="force-center"
          style={{
            marginLeft: '50vw',
            transform: 'translateX(-100%)',
            '--webkit-transform': 'translateX(-100%)',
          }}
        ></IonSpinner>
      )}
    </DashboardLayout>
  );
}
