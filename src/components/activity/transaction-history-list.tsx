import styled from '@emotion/styled';
import { TransactionLayer, TransactionType } from '@helium-pay/backend';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonPopover,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { filterOutline } from 'ionicons/icons';
import { type MouseEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type GridComponents, Virtuoso } from 'react-virtuoso';

import { type IWalletCurrency } from '../../constants/currencies';
import { urls } from '../../constants/urls';
import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';
import { historyGo } from '../../routing/history';
import { themeType } from '../../theme/const';
import { formatMergeAndSortNftAndCryptoTransfers } from '../../utils/formatTransfers';
import { useMyTransfersInfinite } from '../../utils/hooks/useMyTransfersInfinite';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { IconButton, OutlineButton, WhiteButton } from '../common/buttons';
import { Divider } from '../common/divider';
import { AlertIcon } from '../common/icons/alert-icon';
import { TransactionHistoryListItem } from './transaction-history-list-item';

const ALL = 'All';

const LayerButton = styled(OutlineButton)<{ isSelected: boolean }>(
  ({ isSelected }) => ({
    margin: 0,
    minHeight: '14px',
    '--padding-top': '4px',
    '--padding-bottom': '4px',
    ['&::part(native)']: {
      borderRadius: '8px',
      fontSize: '10px',
      fontWeight: 700,
      height: '24px',
      minHeight: '24px',
      minWidth: '48px',
      ['&:active, &:focus, &:hover']: {
        background: 'var(--ion-color-primary-container)',
        color: 'var(--ion-color-white)',
      },
      ...(isSelected
        ? {
            background: 'var(--ion-color-primary-container)',
            color: 'var(--ion-color-white)',
          }
        : {}),
    },
  })
);

const TxnTypeTabsButton = styled(IonButton)<{ isSelected: boolean }>(
  ({ isSelected }) => ({
    margin: 0,
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

interface NFTDropdownProps {
  nftFilter: { coin: boolean; nft: boolean };
  setNftFilter: React.Dispatch<
    React.SetStateAction<{ coin: boolean; nft: boolean }>
  >;
}

const TxnTypeDropdown: React.FC<NFTDropdownProps> = ({
  nftFilter,
  setNftFilter,
}) => {
  const { t } = useTranslation();

  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e: MouseEvent<Element>) => {
    popoverRef.current!.event = e;
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNftFilter = (key: 'coin' | 'nft') => {
    setNftFilter((prev) => {
      const updatedFilter = { ...prev, [key]: !prev[key] };
      if (!updatedFilter.coin && !updatedFilter.nft) {
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
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
      />
      <IonPopover
        side="left"
        alignment="center"
        ref={popoverRef}
        isOpen={isDropdownOpen}
        onDidDismiss={() => setIsDropdownOpen(false)}
        style={{
          '--width': '120px',
          '--max-width': '120px',
        }}
      >
        <IonContent>
          <CheckboxLabel>
            <IonCheckbox
              checked={nftFilter.coin}
              onIonChange={() => toggleNftFilter('coin')}
            />
            {t('Coin')}
          </CheckboxLabel>
          <CheckboxLabel>
            <IonCheckbox
              checked={nftFilter.nft}
              onIonChange={() => toggleNftFilter('nft')}
            />
            NFT
          </CheckboxLabel>
        </IonContent>
      </IonPopover>
    </>
  );
};

export const TransactionHistoryList: React.FC<{
  isFilterLayer?: boolean;
  isFilterType?: boolean;
  isFilterNFT?: boolean;
  currency?: IWalletCurrency;
  minHeight?: string;
  onClick?: () => void;
}> = ({
  isFilterLayer = false,
  isFilterType = false,
  isFilterNFT = false,
  currency,
  minHeight,
  onClick,
}) => {
  const storedTheme = useAppSelector(selectTheme);

  const [layerFilter, setLayerFilter] = useState<typeof ALL | TransactionLayer>(
    ALL
  );
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
      ...(layerFilter !== ALL && { layer: layerFilter }),
      ...(transferTypeFilter !== ALL && { transferType: transferTypeFilter }),
      ...(!!currency && { currency: currency }),
      txnType: [
        ...(txnTypeFilter.coin ? ['currency'] : []),
        ...(txnTypeFilter.nft ? ['nft'] : []),
      ] as ('nft' | 'currency')[],
    }
  );

  const isDataLoaded = !isLoading && !isLoadingNft;

  const layerOptions = [
    { label: t('All'), value: ALL },
    { label: 'L1', value: TransactionLayer.L1 },
    { label: 'L2', value: TransactionLayer.L2 },
  ];

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
          {isFilterLayer && (
            <div className={'ion-display-flex ion-gap-xs'}>
              {layerOptions.map((option) => (
                <LayerButton
                  isSelected={layerFilter === option.value}
                  key={option.value}
                  onClick={() =>
                    setLayerFilter(option.value as TransactionLayer)
                  }
                >
                  {option.label}
                </LayerButton>
              ))}
            </div>
          )}
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
            <TxnTypeDropdown
              nftFilter={txnTypeFilter}
              setNftFilter={setTxnTypeFilter}
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
            />
          )}
        />
      )}
    </div>
  );
};

export default TransactionHistoryList;
