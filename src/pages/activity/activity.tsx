import './activity.scss';

import styled from '@emotion/styled';
import { IonIcon, IonSpinner } from '@ionic/react';
import dayjs from 'dayjs';
import { alertCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { OneActivity } from '../../components/activity/one-activity';
import { Divider } from '../../components/common/divider';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { useTheme } from '../../components/providers/PreferenceProvider';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { themeType } from '../../theme/const';
import { formatMergeAndSortNftAndCryptoTransfers } from '../../utils/formatTransfers';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';

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
export const TableWrapper = styled.div({
  fontSize: '10px',
  padding: '0px 8px',
  color: '#B0A9B3',
});
export const ColumnWrapper = styled.div({
  fontWeight: '700',
});

export const TableHeads = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

export function Activity() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const [storedTheme] = useTheme();
  const [transferParams] = useState({
    startDate: dayjs().subtract(1, 'month').toDate(),
  });
  const { transfers, isLoading } = useTransfersMe({
    ...transferParams,
  });
  const { transfers: nftTransfers, isLoading: isLoadingNft } =
    useNftTransfersMe();
  const walletFormatTransfers = formatMergeAndSortNftAndCryptoTransfers(
    transfers,
    nftTransfers
  );
  return (
    <DashboardLayout>
      <TableWrapper>
        <TableHeads>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginLeft: '8px',
            }}
          >
            <ColumnWrapper>{t('State')}</ColumnWrapper>
            <ColumnWrapper>{t('TransactionType')}</ColumnWrapper>
          </div>
          <ColumnWrapper style={{ marginRight: '8px' }}>
            {t('Amount/NFT')}
          </ColumnWrapper>
        </TableHeads>
        <Divider
          borderColor={storedTheme === themeType.DARK ? '#2F2F2F' : '#D9D9D9'}
          height={'1px'}
          borderWidth={'0.5px'}
          style={{
            marginTop: '8px',
            marginLeft: '8px',
            marginRight: '8px',
          }}
        />
      </TableWrapper>

      {!isLoading && !isLoadingNft ? (
        walletFormatTransfers.length ? (
          <Virtuoso
            style={{
              margin: '8px 0px',
              minHeight: 'calc(100vh - 240px - var(--ion-safe-area-bottom)',
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
            marginTop: '50%',
            transform: 'translateX(-50%)',
            '--webkit-transform': 'translateX(-50%)',
          }}
        ></IonSpinner>
      )}
    </DashboardLayout>
  );
}
