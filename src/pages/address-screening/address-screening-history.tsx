import styled from '@emotion/styled';
import { type IWalletScreening } from '@helium-pay/backend';
import { IonIcon, IonSpinner, IonText } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { type GridComponents, Virtuoso } from 'react-virtuoso';
import { AlertIcon } from 'src/components/common/icons/alert-icon';

import { AddressScreeningHistoryItem } from '../../components/address-screening/address-screening-history-item';
import { PrimaryButton, WhiteButton } from '../../components/common/buttons';
import { Divider } from '../../components/common/divider';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useWalletScreenHistory } from '../../utils/hooks/useWalletScreenHistory';
import { NoActivityText, NoActivityWrapper } from '../activity/activity';

export const Wrapper = styled.div({
  display: 'flex',
  gap: '24px',
  flexDirection: 'column',
  padding: '0px 24px',
  backgroundColor: 'var(--ion-background)',
});

const SmartScanWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 16px',
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

const renderItem = (_: number, screening: IWalletScreening) => (
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
  const history = useHistory();
  const { screenings, count, isLoading, isLoadingMore, setSize, size } =
    useWalletScreenHistory();

  const loadMore = () => {
    setSize(size + 1);
  };

  return (
    <DashboardLayout showSwitchAccountBar showAddress showRefresh>
      <Wrapper>
        <IonText
          color="primary-10"
          className="ion-text-bold ion-padding-top-xs ion-padding-bottom-xs ion-text-align-center ion-text-size-xl"
        >
          {t('ViewHistory')}
        </IonText>
      </Wrapper>

      {isLoading && (
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
      {!isLoading && count === 0 && (
        <NoActivityWrapper>
          <AlertIcon />
          <NoActivityText>{t('NoActivity')}</NoActivityText>
        </NoActivityWrapper>
      )}
      {!isLoading && count !== 0 && (
        <SmartScanWrapper>
          <Virtuoso
            style={{
              margin: '8px 0px',
              minHeight: 'calc(100vh - 330px - var(--ion-safe-area-bottom)',
            }}
            data={screenings}
            itemContent={renderItem}
            context={{ loading: isLoadingMore, loadMore }}
            components={{
              Footer:
                count && screenings.length < count ? ListFooter : undefined,
            }}
          />
        </SmartScanWrapper>
      )}
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
          style={{ width: '150px', margin: 0 }}
          onClick={() => {
            history.push(akashicPayPath(urls.addressScreeningNewScan));
          }}
        >
          <IonIcon icon={addOutline} />
          {t('NewScan')}
        </PrimaryButton>
      </SmartScanFooter>
    </DashboardLayout>
  );
};
