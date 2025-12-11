import styled from '@emotion/styled';
import {
  type CryptoCurrency,
  TransactionLayer,
  TransactionType,
} from '@helium-pay/backend';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonModal,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { closeOutline, filterOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type GridComponents, Virtuoso } from 'react-virtuoso';

import { urls } from '../../constants/urls';
import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';
import { historyGo } from '../../routing/history';
import { themeType } from '../../theme/const';
import { formatMergeAndSortNftAndCryptoTransfers } from '../../utils/formatTransfers';
import { useMyTransfersInfinite } from '../../utils/hooks/useMyTransfersInfinite';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { IconButton, PrimaryButton, WhiteButton } from '../common/buttons';
import { Divider } from '../common/divider';
import { AlertIcon } from '../common/icons/alert-icon';
import { TransactionHistoryListItem } from './transaction-history-list-item';
import { ViewMode, ViewModeDropdown } from './view-mode';

const ALL = 'All';

const TxnTypeTabsButton = styled(IonButton)<{ isSelected: boolean }>(
  ({ isSelected }) => ({
    margin: 0,
    // eslint-disable-next-line sonarjs/no-duplicate-string
    color: 'var(--ion-color-inverse-surface)',
    fontSize: '10px',
    fontWeight: 700,
    minHeight: '24px',
    height: '24px',
    textTransform: 'capitalize',
    borderBottom: '1px solid transparent',
    ['&::part(native)']: {
      padding: '4px 8px',
      background: 'transparent',
    },
    '&:hover': {
      borderBottom: '1px solid var(--ion-color-tertiary-shade)',
    },
    ...(isSelected
      ? {
          borderBottom: '1px solid var(--ion-color-tertiary-shade)',
        }
      : {}),
  })
);

const CheckboxLabel = styled.label({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 12px',
  cursor: 'pointer',
  color: 'var(--ion-color-inverse-surface)',
  fontSize: '12px',
  fontWeight: 700,
  width: '100%',
  borderRadius: '6px',
});

export const NoActivityWrapper = styled.div({
  width: '100%',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  marginTop: '80px',
});
export const NoActivityText = styled.div({
  fontFamily: 'Nunito Sans',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

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
        style={{ minWidth: 200 }}
      >
        {loading ? t('Loading') : t('LoadMore')}
      </WhiteButton>
    </div>
  );
};

interface FilterDropdownProps {
  nftFilter: { coin: boolean; nft: boolean };
  setNftFilter: React.Dispatch<
    React.SetStateAction<{ coin: boolean; nft: boolean }>
  >;
  layerFilter: { l1: boolean; l2: boolean };
  setLayerFilter: React.Dispatch<
    React.SetStateAction<{ l1: boolean; l2: boolean }>
  >;
  currency?: boolean;
}

const FiltersDropdown: React.FC<FilterDropdownProps> = ({
  nftFilter,
  setNftFilter,
  layerFilter,
  setLayerFilter,
  currency,
}) => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempNftFilter, setTempNftFilter] = useState(nftFilter);
  const [tempLayerFilter, setTempLayerFilter] = useState(layerFilter);

  const openModal = () => {
    setTempNftFilter(nftFilter);
    setTempLayerFilter(layerFilter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setTempNftFilter({ coin: true, nft: true });
    setTempLayerFilter({ l1: true, l2: true });
  };

  const handleApply = () => {
    setNftFilter(tempNftFilter);
    setLayerFilter(tempLayerFilter);
    setIsModalOpen(false);
  };

  const toggleTempNftFilter = (key: 'coin' | 'nft') => {
    setTempNftFilter((prev) => {
      const updatedFilter = { ...prev, [key]: !prev[key] };
      if (!updatedFilter.coin && !updatedFilter.nft) {
        updatedFilter[key] = true;
      }
      return updatedFilter;
    });
  };

  const toggleTempLayerFilter = (key: 'l1' | 'l2') => {
    setTempLayerFilter((prev) => {
      const updatedFilter = { ...prev, [key]: !prev[key] };
      if (!updatedFilter.l1 && !updatedFilter.l2) {
        updatedFilter[key] = true;
      }
      return updatedFilter;
    });
  };

  return (
    <>
      <IconButton
        className={'ion-margin-0'}
        size={24}
        icon={filterOutline}
        onClick={openModal}
      />
      <IonModal
        handle={true}
        initialBreakpoint={0.92}
        breakpoints={[0, 0.92]}
        isOpen={isModalOpen}
        onIonModalDidDismiss={closeModal}
        style={{
          '--border-radius': '24px',
          '--background': 'var(--ion-background-color)',
        }}
      >
        <IonContent style={{ '--background': 'var(--ion-background-color)' }}>
          <div
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <IconButton
                size={24}
                icon={closeOutline}
                onClick={closeModal}
                style={{ color: 'var(--ion-color-inverse-surface)' }}
              />
              <IonButton
                fill="clear"
                onClick={handleReset}
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--ion-color-inverse-surface)',
                  textTransform: 'none',
                }}
              >
                {t('Reset')}
              </IonButton>
            </div>

            {/* Title */}
            <h2
              style={{
                textAlign: 'left',
                fontSize: '20px',
                fontWeight: 700,
                margin: '0 0 32px 0',
                color: 'var(--ion-color-inverse-surface)',
              }}
            >
              {t('Filters')}
            </h2>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {/* Transaction Layers Section */}
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 700,
                    margin: '0 0 16px 0',
                    color: 'var(--ion-color-inverse-surface)',
                  }}
                >
                  {t('TransactionLayers')}
                </h3>
                <CheckboxLabel>
                  <IonCheckbox
                    checked={tempLayerFilter.l1}
                    onIonChange={() => toggleTempLayerFilter('l1')}
                    style={{ '--size': '24px', '--border-radius': '4px' }}
                  />
                  <span style={{ fontSize: '16px' }}>{t('Layer1')}</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <IonCheckbox
                    checked={tempLayerFilter.l2}
                    onIonChange={() => toggleTempLayerFilter('l2')}
                    style={{ '--size': '24px', '--border-radius': '4px' }}
                  />
                  <span style={{ fontSize: '16px' }}>{t('Layer2')}</span>
                </CheckboxLabel>
              </div>

              {/* Transaction Types Section */}
              {!currency && (
                <div>
                  <h3
                    style={{
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: 700,
                      margin: '0 0 16px 0',
                      color: 'var(--ion-color-inverse-surface)',
                    }}
                  >
                    {t('TransactionTypes')}
                  </h3>
                  <CheckboxLabel>
                    <IonCheckbox
                      checked={tempNftFilter.coin}
                      onIonChange={() => toggleTempNftFilter('coin')}
                      style={{ '--size': '24px', '--border-radius': '4px' }}
                    />
                    <span style={{ fontSize: '16px' }}>{t('Coin')}</span>
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <IonCheckbox
                      checked={tempNftFilter.nft}
                      onIonChange={() => toggleTempNftFilter('nft')}
                      style={{ '--size': '24px', '--border-radius': '4px' }}
                    />
                    <span style={{ fontSize: '16px' }}>{t('NFT')}</span>
                  </CheckboxLabel>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <PrimaryButton
              expand="block"
              onClick={handleApply}
              style={{
                marginTop: '24px',
                fontSize: '16px',
                fontWeight: 700,
                height: '56px',
                borderRadius: '28px',
                textTransform: 'none',
              }}
            >
              {t('ApplyFilters')}
            </PrimaryButton>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export const TransactionHistoryList: React.FC<{
  isFilterType?: boolean;
  isFilterNFT?: boolean;
  currency?: CryptoCurrency;
  minHeight?: string;
  onClick?: () => void;
}> = ({
  isFilterType = false,
  isFilterNFT = false,
  currency,
  minHeight,
  onClick,
}) => {
  const storedTheme = useAppSelector(selectTheme);

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.RemainingBalance);

  const [layerFilter, setLayerFilter] = useState<{ l1: boolean; l2: boolean }>({
    l1: true,
    l2: true,
  });

  const [transferTypeFilter, setTransferTypeFilter] = useState<
    typeof ALL | TransactionType
  >(ALL);
  const [txnTypeFilter, setTxnTypeFilter] = useState<{
    coin: boolean;
    nft: boolean;
  }>({
    coin: true,
    nft: true,
  });
  const { t } = useTranslation();
  const {
    transfers,
    transactionCount,
    isLoading,
    isLoadingMore,
    setSize,
    size,
  } = useMyTransfersInfinite();
  const { transfers: nftTransfers, isLoading: isLoadingNft } =
    useNftTransfersMe();

  const formattedTransfers = formatMergeAndSortNftAndCryptoTransfers(
    transfers,
    nftTransfers,
    {
      ...(!layerFilter.l1 && layerFilter.l2 && { layer: TransactionLayer.L2 }),
      ...(layerFilter.l1 && !layerFilter.l2 && { layer: TransactionLayer.L1 }),
      ...(transferTypeFilter !== ALL && { transferType: transferTypeFilter }),
      ...(!!currency && { currency: currency }),
      txnType: [
        ...(txnTypeFilter.coin ? ['currency'] : []),
        ...(txnTypeFilter.nft ? ['nft'] : []),
      ] as ('nft' | 'currency')[],
    }
  );

  const isDataLoaded = !isLoading && !isLoadingNft;

  const typeOptions = [
    { label: t('All'), value: ALL },
    { label: t('Deposit'), value: TransactionType.DEPOSIT },
    { label: t('Withdrawal'), value: TransactionType.WITHDRAWAL },
  ];

  return (
    <div>
      <div>
        <div
          className={
            'ion-display-flex ion-justify-content-between ion-align-items-center '
          }
        >
          <IonText>
            <h4 className={'ion-margin-0'}>{t('History')}</h4>
          </IonText>
          <ViewModeDropdown
            selectedMode={viewMode}
            onModeChange={setViewMode}
          />
        </div>
        <Divider
          borderColor={storedTheme === themeType.DARK ? '#2F2F2F' : '#D9D9D9'}
          height={'1px'}
          borderWidth={'0.5px'}
        />
        <div
          className={
            'ion-display-flex ion-justify-content-between ion-align-items-center'
          }
        >
          {isFilterType && (
            <div>
              {typeOptions.map((option) => (
                <TxnTypeTabsButton
                  key={option.value}
                  isSelected={transferTypeFilter === option.value}
                  onClick={() =>
                    setTransferTypeFilter(option.value as TransactionType)
                  }
                >
                  {option.label}
                </TxnTypeTabsButton>
              ))}
            </div>
          )}
          {isFilterNFT && (
            <FiltersDropdown
              nftFilter={txnTypeFilter}
              setNftFilter={setTxnTypeFilter}
              layerFilter={layerFilter}
              setLayerFilter={setLayerFilter}
              currency={!!currency}
            />
          )}
        </div>
      </div>
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
      {isDataLoaded && formattedTransfers.length === 0 && (
        <NoActivityWrapper>
          <AlertIcon />
          <NoActivityText>{t('NoActivity')}</NoActivityText>
        </NoActivityWrapper>
      )}
      {isDataLoaded && formattedTransfers.length > 0 && (
        <Virtuoso
          className="ion-content-scroll-host"
          style={{
            margin: '8px 0px',
            minHeight:
              minHeight ?? 'calc(100vh - 220px - var(--ion-safe-area-bottom))',
          }}
          data={formattedTransfers}
          context={{
            loading: isLoadingMore,
            loadMore: () => setSize(size + 1),
          }}
          components={{
            Footer:
              (transactionCount ?? 0) &&
              transfers.length < (transactionCount ?? 0)
                ? ListFooter
                : undefined,
          }}
          itemContent={(index, transfer) => (
            <TransactionHistoryListItem
              onClick={() => {
                onClick && onClick();
                historyGo(urls.activityDetails, {
                  activityDetails: {
                    currentTransfer: transfer,
                  },
                });
              }}
              transfer={transfer}
              showDetail
              hasHoverEffect
              divider={index !== formattedTransfers.length - 1}
              viewMode={viewMode}
            />
          )}
        />
      )}
    </div>
  );
};

export default TransactionHistoryList;
