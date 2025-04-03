import styled from '@emotion/styled';
import { TransactionLayer, TransactionStatus } from '@helium-pay/backend';
import { IonIcon, IonImg } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { WalletTransactionRecord } from '../../pages/activity';
import { formatDate } from '../../utils/formatDate';
import { displayLongCurrencyAmount } from '../../utils/long-amount';
import { L2Icon } from '../../utils/supported-currencies';
const OneTransfer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  gap: '16px',
  height: '58px',
  width: '370px',
  margin: '24px auto',
});

const ActivityWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignContent: 'center',
  padding: '0',
  gap: '8px',
  height: '40px',
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
  fontFamily: 'Nunito Sans',
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
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignContent: 'center',
  padding: '3px 8px',
  gap: '45px',
  width: '122px',
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
  fontFamily: 'Nunito Sans',
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
  fontFamily: 'Nunito Sans',
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
 */
export function OneActivity({
  transfer,
  children,
  onClick,
  style,
  showDetail,
}: {
  transfer: WalletTransactionRecord;
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  showDetail?: boolean;
}) {
  const { t } = useTranslation();
  const isL2 = transfer.layer === TransactionLayer.L2;
  const transferType =
    transfer.transferType === 'Deposit' ? t('Deposit') : t('Send');
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
    <OneTransfer key={transfer.id} onClick={onClick} style={style}>
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
      {children}
    </OneTransfer>
  );
}
