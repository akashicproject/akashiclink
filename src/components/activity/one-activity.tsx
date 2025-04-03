import styled from '@emotion/styled';
import {
  TransactionLayer,
  TransactionStatus,
  TransactionType,
} from '@helium-pay/backend';
import { IonImg } from '@ionic/react';
// TODO: Replace these by non-mui things
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider } from '../../pages/activity';
import { themeType } from '../../theme/const';
import { limitDecimalPlaces } from '../../utils/conversions';
import { formatDate } from '../../utils/formatDate';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { displayLongCurrencyAmount } from '../../utils/long-amount';
import { useTheme } from '../PreferenceProvider';

const L2Icon = '/shared-assets/images/PayLogo-all-white.svg';

const ActivityWrapper = styled.div<{ hover: boolean }>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  // Gap between the elements
  gap: '8px',
  '&:hover': {
    background: props.hover ? 'rgba(103, 80, 164, 0.14)' : 'transparent',
  },
}));

const TimeWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  width: 'calc(308px/3)',
  height: '40px',
  fontSize: '10px',
  lineHeight: '16px',
  fontWeight: 400,
  color: 'var(--ion-color-primary-10)',
});

const Type = styled.div({
  fontSize: '10px',
  fontWeight: '700',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '45px',
  width: '100%',
  height: '23px',
  border: '1px solid #958E99',
  borderRadius: '8px 0px 0px 0px',
  whiteSpace: 'nowrap',
});

const TypeIcon = styled.div({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px 8px',
  gap: '45px',
  width: '22px',
  height: '23px',
  border: '1px solid #958E99',
  borderRadius: '0px 8px 0px 0px',
});

const Time = styled.div({
  boxSizing: 'border-box',
  width: '100%',
  textAlign: 'center',
  height: '18px',
  border: '1px solid #958E99',
  borderTop: '0px',
  borderRadius: '0px 0px 8px 8px',
  fontSize: '8px',
});

const Chain = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px',
  gap: '12px',
  width: 'calc(308px/3)',
  height: '40px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 700,
  color: '#FFFFFF',
});

const Amount = styled.div({
  boxSizing: 'border-box',
  border: '1px solid #958E99',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '4px 12px',
  width: 'calc(308px/3)',
  height: '40px',
  fontSize: '10px',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
});

const NftItem = styled.div({
  boxSizing: 'border-box',
  border: '1px solid #958E99',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '4px 12px',
  width: '50%',
  height: '40px',
  fontSize: '10px',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
});

const NftImage = styled.div({
  boxSizing: 'border-box',
  border: '1px solid #958E99',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  width: '50%',
  height: '40px',
  fontSize: '10px',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
});

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

  /**
   * Style the icon displaying the chain information:
   * - L2 transactions need to display the full AkashicChain text and so need less padding
   * - If the more-info-chevron is displayed, reduce the spacing
   */
  const iconStyle = {
    gap: isL2 ? '0px' : showDetail ? '8px' : '12px',
    backgroundColor:
      isL2 || isNft
        ? storedTheme === themeType.DARK
          ? '#C297FF'
          : '#290056'
        : '#7444B6',
  };

  return (
    <>
      <ActivityWrapper
        key={transfer.id}
        onClick={onClick}
        style={style}
        hover={hasHoverEffect || false}
      >
        <TimeWrapper>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Type>
              {transfer.status === TransactionStatus.FAILED ? (
                <span
                  style={{
                    color: '#DE3730',
                  }}
                >
                  {`${transferType} - ${t('Failed')}`}
                </span>
              ) : transfer.status === TransactionStatus.PENDING ? (
                <span
                  style={{
                    color: '#DE3730',
                  }}
                >
                  {`${transferType} - ${t('Pending')}`}
                </span>
              ) : (
                transferType
              )}
            </Type>
            <TypeIcon>
              {transfer.status === TransactionStatus.FAILED ? (
                <ErrorOutlineIcon
                  sx={{
                    fontSize: 'medium',
                    color: 'error.main',
                  }}
                />
              ) : transfer.status === TransactionStatus.PENDING ? (
                <RotateRightOutlinedIcon
                  sx={{
                    fontSize: 'medium',
                    color: 'error.main',
                  }}
                />
              ) : (
                <CheckOutlinedIcon
                  sx={{
                    fontSize: 'medium',
                    color: '#41CC9A',
                  }}
                />
              )}
            </TypeIcon>
          </div>
          <Time>{formatDate(new Date(transfer.date))}</Time>
        </TimeWrapper>
        <Chain
          style={
            transfer.status !== TransactionStatus.CONFIRMED
              ? {
                  ...iconStyle,
                  filter: 'brightness(100%)',
                  backgroundColor:
                    storedTheme === themeType.LIGHT ? '#B0A9B3' : '#4A454E',
                }
              : {
                  ...iconStyle,
                }
          }
        >
          <IonImg
            alt=""
            src={isL2 || isNft ? L2Icon : transfer.networkIcon}
            style={{ height: isL2 || isNft ? '20px' : '12px' }}
          />
          {isL2 || isNft ? null : label}
        </Chain>

        {isNft ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: 'calc(308px/3)',
              gap: '8px',
              justifyContent: 'space-between',
            }}
          >
            <NftItem>NFT</NftItem>
            <NftImage
              style={{
                height: '40px',
                width: '40px',
              }}
            >
              <IonImg src={transfer?.nft?.image}></IonImg>
            </NftImage>
          </div>
        ) : (
          <Amount
            style={{
              color:
                transfer.status !== TransactionStatus.CONFIRMED
                  ? '#B0A9B3'
                  : storedTheme === themeType.LIGHT
                  ? '#290056'
                  : 'inherit',
            }}
          >
            {/* HACK: Reduce currency symbols to a single word to fit small screen */}
            {displayLongCurrencyAmount(
              limitDecimalPlaces(transfer.amount || '0'),
              transfer?.currency?.displayName?.split('-')[0] || ''
            )}
          </Amount>
        )}
      </ActivityWrapper>
      {divider && (
        <Divider
          style={{ margin: '8px 0px' }}
          borderColor={storedTheme === themeType.DARK ? '#2F2F2F' : '#D9D9D9'}
          height={'1px'}
          borderWidth={'0.5px'}
        />
      )}
    </>
  );
}
