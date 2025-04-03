import './activity.scss';

import styled from '@emotion/styled';
import {
  IonBackdrop,
  IonButton,
  IonButtons,
  IonCard,
  IonCardTitle,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { alertCircleOutline, closeOutline } from 'ionicons/icons';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { ActivityDetail } from '../components/activity/activity-detail';
import { OneActivity } from '../components/activity/one-activity';
import { LoggedLayout } from '../components/layout/logged-layout';
import { OneNft } from '../components/nft/one-nft';
import { urls } from '../constants/urls';
import type { ITransactionRecordForExtension } from '../utils/formatTransfers';
import { formatMergeAndSortNftAndCryptoTransfers } from '../utils/formatTransfers';
import { useNftTransfersMe } from '../utils/hooks/useNftTransfersMe';
import { useTransfersMe } from '../utils/hooks/useTransfersMe';
import { cacheCurrentPage } from '../utils/last-page-storage';

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

// @TODO can be used when we add text.
// export const NoActivityWrapper = styled.div({
//   width: '100%',
//   display: 'inline-flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   gap: '8px',
//   marginTop: '200px',
// });
// export const NoActivityText = styled.div({
//   fontFamily: 'Nunito Sans',
//   fontStyle: 'normal',
//   fontWeight: 700,
//   fontSize: '16px',
//   lineHeight: '24px',
//   color: 'var(--ion-color-primary-10)',
// });
const Header = styled.h2({
  color: 'var(--ion-color-primary-dark)',
});
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

export const ActivityDetailComponent = ({
  transfer,
  setIsOpen,
}: {
  transfer: ITransactionRecordForExtension;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <IonCard class="activity-card unselectable">
      {transfer.nft ? (
        <div>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>
                <IonIcon
                  class="icon-button-icon icon-dark"
                  slot="icon-only"
                  icon={closeOutline}
                />
              </IonButton>
            </IonButtons>
          </div>
          <OneNft
            style={{
              position: 'relative',
              margin: '0 auto',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '18px',
              display: 'block',
            }}
            nft={transfer.nft}
            isNameHidden={true}
            isAccountNameHidden={false}
            isBig={true}
            nftNameStyle={{
              textAlign: 'center',
              fontSize: '19px',
              width: '100%',
              margin: '10px',
              color: 'rgb(41, 0, 86)',
            }}
          />
          <Header>{t('TransactionDetails')}</Header>
        </div>
      ) : (
        <IonCardTitle>
          <div className="spread">
            <Header>{t('ContractInteraction')}</Header>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>
                <IonIcon
                  class="icon-button-icon icon-dark"
                  slot="icon-only"
                  icon={closeOutline}
                />
              </IonButton>
            </IonButtons>
          </div>
        </IonCardTitle>
      )}
      <ActivityDetail currentTransfer={transfer} />
    </IonCard>
  );
};
export function Activity() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTransfer, setCurrentTransfer] =
    useState<ITransactionRecordForExtension>();
  useEffect(() => {
    cacheCurrentPage(urls.activity);
  }, []);
  const [transferParams, _] = useState({
    startDate: dayjs().subtract(1, 'month').toDate(),
  });
  const { transfers, isLoading } = useTransfersMe(transferParams);
  const { transfers: nftTransfers, isLoading: isLoadingNft } =
    useNftTransfersMe(transferParams);
  const walletFormatTransfers = formatMergeAndSortNftAndCryptoTransfers(
    transfers,
    nftTransfers
  );
  return (
    <LoggedLayout>
      {isOpen && <IonBackdrop />}
      {isOpen && currentTransfer && (
        <ActivityDetailComponent
          transfer={currentTransfer}
          setIsOpen={setIsOpen}
        />
      )}
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
                  setIsOpen(true);
                  setCurrentTransfer(transfer);
                }}
                showDetail={true}
                hasHoverEffect={true}
                divider={index !== walletFormatTransfers.length - 1}
              />
            )}
          />
        ) : (
          <NoActivityWrapper>
            <IonIcon icon={alertCircleOutline} class="alert-icon" />
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
    </LoggedLayout>
  );
}
