import styled from '@emotion/styled';
import { type IWalletScreeningObject } from '@helium-pay/backend';
import { IonIcon, IonSpinner, IonText, isPlatform } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type GridComponents, Virtuoso } from 'react-virtuoso';

import {
  NoActivityText,
  NoActivityWrapper,
} from '../../components/activity/transaction-history-list';
import { AddressScreeningHistoryItem } from '../../components/address-screening/address-screening-history-item';
import { AddressScreeningNewScanModal } from '../../components/address-screening/address-screening-new-scan-modal';
import { PrimaryButton, WhiteButton } from '../../components/common/buttons';
import { Divider } from '../../components/common/divider';
import { AlertIcon } from '../../components/common/icons/alert-icon';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { useIsScopeAccessAllowed } from '../../utils/account';
import { useWalletScreenHistory } from '../../utils/hooks/useWalletScreenHistory';

export const Wrapper = styled.div({
  display: 'flex',
  gap: '24px',
  flexDirection: 'column',
  padding: '0px 24px',
  backgroundColor: 'var(--ion-background)',
});

const SmartScanFooter = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  paddingBlockStart: 8,
  gap: 8,
});

const renderItem = (_: number, screening: IWalletScreeningObject) => (
  <AddressScreeningHistoryItem
    screening={screening}
    showDetail
    hasHoverEffect
    divider
  />
);

const ListFooter: GridComponents['Footer'] = ({
  context: { loadMore, loading },
}) => {
  const { t } = useTranslation();

  return (
    <div className={'ion-display-flex ion-justify-content-center'}>
      <WhiteButton
        expand="block"
        size={'small'}
        disabled={loading}
        onClick={loadMore}
        style={{
          minWidth: 200,
        }}
      >
        {loading ? t('Loading') : t('LoadMore')}
      </WhiteButton>
    </div>
  );
};

export const AddressScreeningHistory = () => {
  const { t } = useTranslation();
  const isMobile = isPlatform('ios') || isPlatform('android');
  const isNewScanAllowed = useIsScopeAccessAllowed('addressScanning');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLIonModalElement>(null);

  const { screenings, count, isLoadingMore, setSize, size } =
    useWalletScreenHistory();

  const loadMore = () => {
    setSize(size + 1);
  };

  const isLoading = false;

  return (
    <DashboardLayout>
      <Wrapper>
        <IonText
          color="primary-10"
          className="ion-text-bold ion-padding-top-lg ion-padding-bottom-xs ion-text-align-center ion-text-size-xl"
        >
          {t('ViewHistory')}
        </IonText>
      </Wrapper>

      <div
        style={{
          margin: '8px 0px',
          padding: '0px 16px',
          minHeight: `calc(100vh - ${isMobile ? '360px - var(--ion-safe-area-bottom)' : '288px'})`,
        }}
      >
        {isLoading && (
          <IonSpinner
            color="primary"
            name="circular"
            class="force-center"
            style={{
              marginTop: '50%',
              marginLeft: '50vw',
              transform: 'translateX(-50%)',
              '--webkit-transform': 'translateX(-50%)',
            }}
          />
        )}
        {!isLoading && count === 0 && (
          <NoActivityWrapper
            style={{ marginTop: '100px', marginBottom: '100px' }}
          >
            <AlertIcon />
            <NoActivityText>{t('NoActivity')}</NoActivityText>
          </NoActivityWrapper>
        )}
        {!isLoading && count !== 0 && (
          <Virtuoso
            style={{
              margin: '8px 0',
              minHeight: `calc(100vh - ${isMobile ? '360px - var(--ion-safe-area-bottom)' : '288px'})`,
            }}
            data={screenings}
            itemContent={renderItem}
            context={{ loading: isLoadingMore, loadMore }}
            components={{
              Footer:
                count && screenings.length < count ? ListFooter : undefined,
            }}
          />
        )}
      </div>
      <SmartScanFooter>
        <Divider
          style={{ width: '328px', margin: 0 }}
          className={'ion-margin-left-xs ion-margin-right-xs'}
          borderColor={'var(--activity-list-divider)'}
          height={'1px'}
          borderWidth={'0.5px'}
        />
        <IonText
          style={{ fontWeight: 700 }}
          className="ion-text-size-xs text-center"
        >
          {t('ScanAddressReport')}
        </IonText>
        <PrimaryButton
          disabled={!isNewScanAllowed}
          style={{ width: '150px', margin: 0 }}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <IonIcon icon={addOutline} />
          {t('NewScan')}
        </PrimaryButton>
      </SmartScanFooter>
      <AddressScreeningNewScanModal
        modal={modalRef}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </DashboardLayout>
  );
};
