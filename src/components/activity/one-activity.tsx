import styled from '@emotion/styled';
import {
  TransactionLayer,
  TransactionStatus,
  TransactionType,
} from '@helium-pay/backend';
import { IonIcon, IonImg } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import type { WalletTransactionRecord } from '../../pages/activity';
import { Divider } from '../../pages/activity';
import { formatDate } from '../../utils/formatDate';
import { displayLongCurrencyAmount } from '../../utils/long-amount';
import { L2Icon } from '../../utils/supported-currencies';
const OneTransfer = styled.div<{ hover: boolean }>((props) => ({
  display: 'flex',
  gap: '16px',
  cursor: props.hover ? 'pointer' : 'auto',
  transition: 'background ease-in-out 0.3s',
  '&:hover': {
    background: props.hover ? 'rgba(103, 80, 164, 0.14)' : 'transparent',
  },
}));

const ActivityWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '8px 0',
  // Gap between the elements
  gap: '8px',
});

const TimeWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  width: '122px',
  height: '40px',
  fontSize: '10px',
  lineHeight: '16px',
  fontWeight: 400,
  color: 'var(--ion-color-primary-10)',
});

const Type = styled.div({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px 8px',
  gap: '45px',
  width: '122px',
  height: '23px',
  border: '1px solid #958E99',
  borderRadius: '8px 8px 0px 0px',
});

const Time = styled.div({
  boxSizing: 'border-box',
  width: '122px',
  textAlign: 'center',
  height: '18px',
  border: '1px solid #958E99',
  borderRadius: '0px 0px 8px 8px',
});

const Chain = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px',
  gap: '12px',
  width: '120px',
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
  width: '86px',
  height: '40px',
  fontSize: '10px',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
});

const Icon = styled(IonIcon)({
  padding: '0',
  margin: '0',
});

/**
 * Display of a single transfer
 * @param transfer
 * @param onClick callback
 * @param style addition to apply to the bounding vox
 * @param showDetail arrow, inviting user to click and see full transfer information
 * @param divider separator after
 */
export function OneActivity({
  transfer,
  onClick,
  style,
  showDetail,
  hasHoverEffect,
  divider,
}: {
  transfer: WalletTransactionRecord;
  onClick?: () => void;
  style?: CSSProperties;
  showDetail?: boolean;
  hasHoverEffect?: boolean;
  divider?: boolean;
}) {
  const { t } = useTranslation();
  const isL2 = transfer.layer === TransactionLayer.L2;
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
    background: isL2 ? '#290056' : '#7444B6',
  };

  return (
    <>
      <OneTransfer
        key={transfer.id}
        onClick={onClick}
        style={style}
        hover={hasHoverEffect as boolean}
      >
        <ActivityWrapper>
          <TimeWrapper>
            <Type>
              {transfer.status === TransactionStatus.FAILED
                ? `${transferType} - ${t('Failed')}`
                : transferType}
            </Type>
            <Time>{formatDate(new Date(transfer.date))}</Time>
          </TimeWrapper>
          <Chain style={iconStyle}>
            <IonImg
              alt=""
              src={isL2 ? L2Icon : transfer.icon}
              style={{ height: isL2 ? '20px' : '12px' }}
            />
            {isL2 ? null : label}
          </Chain>
          {/* HACK: Reduce currency symbols to a single word to fit small screen */}
          <Amount>
            {displayLongCurrencyAmount(
              transfer.amount,
              transfer.currency.displayName.split('-')[0]
            )}
          </Amount>
          {showDetail ? <Icon icon={chevronForwardOutline} /> : null}
        </ActivityWrapper>
      </OneTransfer>
      {divider && <Divider />}
    </>
  );
}
