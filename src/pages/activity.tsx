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
import { Virtuoso } from 'react-virtuoso';

import { ActivityDetail } from '../components/activity/activity-detail';
import { OneActivity } from '../components/activity/one-activity';
import { LoggedLayout } from '../components/layout/logged-layout';
import { urls } from '../constants/urls';
import type { ITransactionRecordForExtension } from '../utils/formatTransfers';
import { formatTransfers } from '../utils/formatTransfers';
import { useTransfersMe } from '../utils/hooks/useTransfersMe';
import { cacheCurrentPage } from '../utils/last-page-storage';

export const Divider = styled.div({
  boxSizing: 'border-box',
  height: '2px',
  border: '1px solid #D9D9D9',
  width: '100%',
});

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
    endDate: dayjs().toDate(),
  });
  const { transfers, isLoading } = useTransfersMe(transferParams);
  const walletFormatTransfers = formatTransfers(transfers);
  return (
    <LoggedLayout>
      {isOpen && <IonBackdrop />}
      {isOpen && currentTransfer && (
        <ActivityDetailComponent
          transfer={currentTransfer}
          setIsOpen={setIsOpen}
        />
      )}
      {!isLoading ? (
        walletFormatTransfers.length ? (
          <Virtuoso
            style={{
              minHeight: '450px',
              width: '100%',
            }}
            data={walletFormatTransfers}
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
