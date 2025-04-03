import styled from '@emotion/styled';
import {
  TransactionLayer,
  TransactionStatus,
  TransactionType,
} from '@helium-pay/backend';
import { IonImg } from '@ionic/react';
import Big from 'big.js';
// TODO: Replace these by non-mui things
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../constants/currencies';
import { themeType } from '../../theme/const';
import { formatAmount } from '../../utils/formatAmount';
import { formatDate } from '../../utils/formatDate';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { Divider } from '../common/divider';
import { useTheme } from '../providers/PreferenceProvider';

const ActivityWrapper = styled.div<{ hover: boolean }>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  // Gap between the elements
  // gap: '8px',
  '&:hover': {
    background: props.hover ? 'rgba(103, 80, 164, 0.14)' : 'transparent',
  },
  padding: '4px 10px',
}));

const TransactionStatusWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const Type = styled.div({
  fontWeight: 'bold',
  fontSize: '0.625rem',
});

const IconWrapper = styled.div({
  display: 'flex',
  gap: '8px',
});

const TypeIcon = styled.div({
  position: 'relative',
  display: 'inline-block',
});

const Time = styled.div({
  textAlign: 'center',
  fontSize: '0.5rem',
  fontWeight: 400,
});

const Amount = styled.div({
  fontSize: '0.625rem',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
});
const AmountWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '4px',
});
const GasFee = styled.div({
  overflow: 'hidden',
  fontSize: '0.5rem',
  fontWeight: 400,
  color: 'var(--ion-light-text)',
});

const Nft = styled.div({
  display: 'flex',
  gap: '8px',
});

const NftName = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const NftItem = styled.div({
  fontWeight: 'bold',
  fontSize: '0.625rem',
  display: 'flex',
  justifyContent: 'flex-end',
});

const NftImage = styled.div({
  boxSizing: 'border-box',
  border: '1px solid var(--ion-color-dark-ontline)',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  width: '50%',
  height: '40px',
  fontSize: '0.625rem',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
});

const currenciesIcon = [...SUPPORTED_CURRENCIES_FOR_EXTENSION.list];

/**
 * Display of a single transfer
 * @param transfer for the backend
 * @param onClick callback
 * @param style addition to apply to the bounding vox
 * @param showDetail arrow, inviting user to click and see full transfer information
 * @param divider separator after
 */
interface OneActivityProps {
  transfer: ITransactionRecordForExtension;
  onClick?: () => void;
  style?: CSSProperties;
  showDetail?: boolean;
  hasHoverEffect?: boolean;
  divider?: boolean;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function OneActivity({
  transfer,
  onClick,
  style,
  showDetail,
  hasHoverEffect,
  divider,
}: OneActivityProps) {
  const { t } = useTranslation();
  const isL2 = transfer.layer === TransactionLayer.L2;
  const isNft = !!transfer?.nft;
  const [storedTheme] = useTheme();
  const transferType =
    transfer.transferType === TransactionType.DEPOSIT
      ? t('Deposit')
      : t('Send');
  // HACK: Reduce chain names to a single word to fit small screen
  let label = transfer.chain;
  switch (label.split(' ').length) {
    case 2:
      label = label.split(' ')[0];
      break;
    case 3:
      label = label.split(' ')[1];
      break;
  }
  const L2Icon = `/shared-assets/images/${
    transfer.status === TransactionStatus.CONFIRMED
      ? 'akashic-pay-logo'
      : 'akashic-grey-logo'
  }.svg`;
  const currencyObj = currenciesIcon.find(
    (c) => c.walletCurrency.chain === transfer.currency?.chain
  );
  const iconImg =
    isL2 || isNft
      ? L2Icon
      : transfer.status === TransactionStatus.CONFIRMED
      ? currencyObj?.currencyIcon
      : currencyObj?.greyCurrencyIcon;
  /**
   * Style the icon displaying the chain information:
   * - L2 transactions need to display the full AkashicChain text and so need less padding
   * - If the more-info-chevron is displayed, reduce the spacing
   */

  return (
    <>
      <ActivityWrapper
        key={transfer.id}
        onClick={onClick}
        style={style}
        hover={hasHoverEffect || false}
      >
        <IconWrapper>
          <TypeIcon>
            <IonImg
              alt=""
              src={iconImg}
              style={{
                height: '32px',
                width: '32px',
              }}
            />
            <IonImg
              alt=""
              src={`/shared-assets/images/${
                storedTheme === themeType.DARK
                  ? `${transfer.status}-dark`
                  : `${transfer.status}-white`
              }.svg`}
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                height: '16px',
                width: '16px',
              }}
            />
          </TypeIcon>
          <TransactionStatusWrapper>
            {transfer.status !== TransactionStatus.CONFIRMED ? (
              <Type
                style={{
                  color:
                    storedTheme === themeType.DARK
                      ? 'var(--ion-dark-text)'
                      : 'var(--ion-light-text)',
                }}
              >
                {transfer.status === TransactionStatus.PENDING
                  ? `${transferType} - ${t('Pending')}`
                  : `${transferType} - ${t('Failed')}`}
              </Type>
            ) : (
              <Type>{transferType}</Type>
            )}
            {transfer.status !== TransactionStatus.CONFIRMED ? (
              <Time
                style={{
                  color:
                    storedTheme === themeType.DARK
                      ? 'var(--ion-dark-text)'
                      : 'var(--ion-light-text)',
                }}
              >
                {formatDate(new Date(transfer.date))}
              </Time>
            ) : (
              <Time>{formatDate(new Date(transfer.date))}</Time>
            )}
          </TransactionStatusWrapper>
        </IconWrapper>
        {isNft ? (
          <Nft>
            <NftName>
              <NftItem className="ion-margin-top-xxs">{t('NFT')}</NftItem>
              <NftItem
                style={{
                  color:
                    storedTheme === themeType.DARK
                      ? 'var(--ion-dark-text)'
                      : 'var(--ion-light-text)',
                  fontSize: '0.5rem',
                  fontWeight: 400,
                  marginBottom: '4px',
                }}
              >
                {transfer?.nft?.name}
              </NftItem>
            </NftName>
            <NftImage
              style={{
                height: '32px',
                width: '32px',
              }}
            >
              <IonImg src={transfer?.nft?.image}></IonImg>
            </NftImage>
          </Nft>
        ) : (
          <AmountWrapper>
            <Amount
              style={{
                color:
                  transfer.status !== TransactionStatus.CONFIRMED
                    ? storedTheme === themeType.DARK
                      ? 'var(--ion-dark-text)'
                      : 'var(--ion-light-text)'
                    : transfer.type === TransactionType.DEPOSIT
                    ? 'var(--ion-color-success)'
                    : '#ff5449',
              }}
            >
              {`${
                transfer.type === TransactionType.DEPOSIT ? '+' : '-'
              }${formatAmount(transfer.amount)} ${
                transfer.tokenSymbol
                  ? `${transfer?.currency?.token ?? ''} (${
                      transfer?.currency?.chain?.split('-')[0]
                    })`
                  : transfer?.currency?.displayName?.split('-')[0] || ''
              }`}
            </Amount>
            {transfer.feesPaid && (
              <GasFee
                style={{
                  color:
                    storedTheme === themeType.DARK
                      ? 'var(--ion-dark-text)'
                      : 'var(--ion-light-text)',
                }}
              >{`${t('GasFee')}: ${Big(transfer.feesPaid).toFixed(2)}`}</GasFee>
            )}
          </AmountWrapper>
        )}
      </ActivityWrapper>
      {divider && (
        <Divider
          style={{
            marginLeft: '8px',
            marginRight: '8px',
          }}
          borderColor={storedTheme === themeType.DARK ? '#2F2F2F' : '#D9D9D9'}
          height={'1px'}
          borderWidth={'0.5px'}
        />
      )}
    </>
  );
}
