import styled from '@emotion/styled';
import {
  TransactionLayer,
  TransactionStatus,
  TransactionType,
} from '@helium-pay/backend';
import { IonImg } from '@ionic/react';
import Big from 'big.js';
import { type CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../constants/currencies';
import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';
import { themeType } from '../../theme/const';
import { getPrecision, isGasFeeAccurate } from '../../utils/formatAmount';
import { formatAmountWithCommas } from '../../utils/formatAmountWithCommas';
import { formatDate } from '../../utils/formatDate';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { displayLongText } from '../../utils/long-text';
import { getNftImage } from '../../utils/nft-image-link';
import { L2Icon } from '../common/chain-icon/l2-icon';
import { Divider } from '../common/divider';

const ActivityWrapper = styled.div<{ hover: boolean }>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    background: props.hover ? 'rgba(103, 80, 164, 0.14)' : 'transparent',
  },
  padding: '4px',
  cursor: 'pointer',
  ['&:active, &:focus, &:hover']: {
    background: 'rgba(89, 89, 146, 0.08)',
  },
}));

const TransactionStatusWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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
  fontSize: '0.625rem',
  fontWeight: 400,
});

const Amount = styled.div({
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
  fontSize: '0.625rem',
  fontWeight: 400,
  // eslint-disable-next-line sonarjs/no-duplicate-string
  color: 'var(--activity-dim-text)',
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
  fontSize: '0.625rem',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
  height: '32px',
  width: '32px',
});

interface OneActivityProps {
  transfer: ITransactionRecordForExtension;
  onClick?: () => void;
  style?: CSSProperties;
  showDetail?: boolean;
  hasHoverEffect?: boolean;
  divider?: boolean;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function TransactionHistoryListItem({
  transfer,
  onClick,
  style,
  hasHoverEffect,
  divider,
}: OneActivityProps) {
  const { t } = useTranslation();
  const isL2 = transfer.layer === TransactionLayer.L2;
  const isNft = !!transfer?.nft;
  const storedTheme = useAppSelector(selectTheme);

  const isTxnDeposit = transfer.transferType === TransactionType.DEPOSIT;
  const isTxnConfirmed = transfer.status === TransactionStatus.CONFIRMED;

  const currencyObj = SUPPORTED_CURRENCIES_FOR_EXTENSION.list.find(
    (c) => c.walletCurrency.chain === transfer.currency?.chain
  );

  const gasFee = transfer.feesPaid ?? transfer.feesEstimate;
  const isDelegated = !!transfer.feeIsDelegated;

  // Use separate precision for gas and amount so they both show with the
  // minimum necessary (or 2)
  const gasPrecision = getPrecision('0', gasFee ?? '0');
  const gasFeeIsAccurate = isGasFeeAccurate(transfer, gasPrecision);

  // If token, displayed as "USDT" for L1 and "USDT (ETH)" for L2 (since
  // deducing the chain the token belongs to is not trivial)
  const currencyDisplayName = transfer?.currency?.token
    ? transfer?.currency?.token + (isL2 ? ` (${transfer.currency.chain})` : '')
    : transfer?.currency?.chain;

  const totalFee = Big(gasFee ?? '0').add(transfer.fakeGasFee ?? '0');

  let feeText = `${t('GasFee')}: ${gasFeeIsAccurate ? '' : '≈'}${formatAmountWithCommas(totalFee.toString())} ${transfer?.currency?.chain}`;

  if (isDelegated) {
    feeText = `${t('DelegatedGasFee')}: ${
      transfer.internalFee?.withdraw
        ? formatAmountWithCommas(transfer.internalFee?.withdraw ?? '0')
        : '-'
    } ${currencyDisplayName}`;
  }

  const [nftUrl, setNftUrl] = useState('');

  useEffect(() => {
    async function getNft() {
      const nftUrl = await getNftImage(transfer.nft?.ledgerId ?? '', '30');
      setNftUrl(nftUrl);
    }
    getNft();
  }, []);
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
            {isL2 || isNft ? (
              <L2Icon size={32} />
            ) : (
              <IonImg
                alt=""
                src={
                  isTxnConfirmed
                    ? currencyObj?.currencyIcon
                    : currencyObj?.greyCurrencyIcon
                }
                style={{
                  height: '32px',
                  width: '32px',
                }}
              />
            )}

            <IonImg
              alt=""
              src={`/shared-assets/images/${transfer.status}-${
                storedTheme === themeType.DARK ? 'dark' : 'white'
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
            <div
              style={{
                ...(!isTxnConfirmed && {
                  color: 'var(--activity-dim-text)',
                }),
              }}
              className={'ion-text-size-sm ion-text-bold'}
            >
              {`${isTxnDeposit ? t('Deposit') : t('Send')}${
                transfer.status === TransactionStatus.PENDING
                  ? ` - ${t('Pending')}`
                  : transfer.status === TransactionStatus.FAILED
                    ? ` - ${t('Failed')}`
                    : transfer.status === TransactionStatus.QUEUED
                      ? ` - ${t('Queued')}`
                      : ''
              }`}
            </div>
            <Time
              style={{
                ...(!isTxnConfirmed && {
                  color: 'var(--activity-dim-text)',
                }),
              }}
            >
              {formatDate(new Date(transfer.initiatedAt))}
            </Time>
          </TransactionStatusWrapper>
        </IconWrapper>
        {isNft ? (
          <Nft>
            <NftName>
              <NftItem className="ion-margin-top-xxs">{t('NFT')}</NftItem>
              <NftItem
                style={{
                  color: 'var(--ion-color-primary-10)',
                }}
              >
                {displayLongText(transfer?.nft?.alias, 20)}
              </NftItem>
            </NftName>
            <NftImage>
              <IonImg src={nftUrl}></IonImg>
            </NftImage>
          </Nft>
        ) : (
          <AmountWrapper>
            <Amount
              className="ion-text-size-xs"
              style={{
                color: !isTxnConfirmed
                  ? 'var(--activity-dim-text)'
                  : isTxnDeposit
                    ? 'var(--ion-color-success)'
                    : 'var(--ion-color-failed)',
              }}
            >
              {displayLongText(
                `${isTxnDeposit ? '+' : '-'}${formatAmountWithCommas(transfer.amount)} ${currencyDisplayName}`,
                26,
                true
              )}
            </Amount>
            {!isTxnDeposit && gasFee && (
              <GasFee
                style={{
                  color: !isTxnConfirmed
                    ? 'var(--activity-dim-text)'
                    : storedTheme === themeType.DARK
                      ? 'var(--ion-color-primary-10)'
                      : 'var(--ion-light-text)',
                }}
              >
                {feeText}
              </GasFee>
            )}
          </AmountWrapper>
        )}
      </ActivityWrapper>
      {divider && (
        <Divider
          className={'ion-margin-left-xs ion-margin-right-xs'}
          borderColor={'var(--activity-list-divider)'}
          height={'1px'}
          borderWidth={'0.5px'}
        />
      )}
    </>
  );
}
