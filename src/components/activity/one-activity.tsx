import styled from '@emotion/styled';
import { TransactionLayer } from '@helium-pay/backend';
import { IonIcon, IonImg } from '@ionic/react';
import Big from 'big.js';
import { chevronForwardOutline } from 'ionicons/icons';
import type { CSSProperties, ReactNode } from 'react';

import type { WalletTransactionRecord } from '../../pages/activity';
import { formatDate } from '../../utils/formatDate';
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
  color: '#290056',
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
  background: '#7444B6',
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
  fontSize: '12px',
  fontWeight: 700,
  fontFamily: 'Nunito Sans',
  color: '#290056',
});

const Icon = styled(IonIcon)({
  padding: '0',
  margin: '0',
});

export const OneActivity: React.FC<{
  transfer: WalletTransactionRecord;
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  showDetail?: boolean;
}> = ({ transfer, children, onClick, style, showDetail }) => {
  const amount = Big(transfer.amount);
  return (
    <OneTransfer key={transfer.id} onClick={onClick} style={style}>
      <ActivityWrapper>
        <TimeWrapper>
          <Type>{transfer.transferType}</Type>
          <Time>{formatDate(new Date(transfer.date))}</Time>
        </TimeWrapper>
        <Chain style={showDetail ? { gap: '8px' } : { gap: '12px' }}>
          <IonImg
            alt={''}
            src={
              transfer.layer === TransactionLayer.L2 ? L2Icon : transfer.icon
            }
            style={{ height: '12px' }}
          />
          {transfer.currency.displayName}
        </Chain>
        <Amount>{`${amount} ${transfer.currency.displayName}`}</Amount>
        {showDetail ? <Icon icon={chevronForwardOutline} /> : null}
      </ActivityWrapper>
      {children}
    </OneTransfer>
  );
};
