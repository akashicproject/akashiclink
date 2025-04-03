import './activity.scss';

import styled from '@emotion/styled';
import { TransactionLayer, TransactionType } from '@helium-pay/backend';
import { useTranslation } from 'react-i18next';

import { formatAmount } from '../../utils/formatAmount';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { BaseDetails, DetailColumn } from './base-details';

const TransactionalDetailsDivider = styled.div({
  margin: '16px 0px',
  border: '1px solid #EEEEEE',
  height: '1px',
});
const Header3 = styled.h3({
  textAlign: 'left',
  margin: '0px',
});
const VerticalWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignContent: 'center',
});
const HorizontalWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});
const TextColor = {
  color: 'var(--ion-color-primary-10)',
};
export function TransactionDetails({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) {
  return (
    <>
      <BaseDetails currentTransfer={currentTransfer} />
      <TransactionalDetailsDivider style={{ margin: '8px' }} />
      {currentTransfer.transferType === TransactionType.DEPOSIT ? (
        <DepositDetails currentTransfer={currentTransfer} />
      ) : (
        <WithdrawDetails currentTransfer={currentTransfer} />
      )}
    </>
  );
}
const WithdrawDetails = ({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) => {
  const { t } = useTranslation();
  const isTransactionL2 = currentTransfer.layer === TransactionLayer.L2;
  return (
    <HorizontalWrapper>
      <Header3>Send</Header3>
      <VerticalWrapper>
        <DetailColumn>
          <span style={TextColor} className="ion-text-size-xs">
            {isTransactionL2 ? 'Fee' : t('Gas fee')}
          </span>
        </DetailColumn>
        <DetailColumn>
          <Header3>
            {formatAmount(
              isTransactionL2
                ? currentTransfer.internalFee?.withdraw ?? '0'
                : currentTransfer.feesPaid ?? '0'
            )}{' '}
            {isTransactionL2
              ? currentTransfer.tokenSymbol || currentTransfer.coinSymbol
              : currentTransfer.coinSymbol}
          </Header3>
        </DetailColumn>
      </VerticalWrapper>
      <VerticalWrapper>
        <DetailColumn>
          <span style={TextColor} className="ion-text-size-xs">
            {t('Amount')}
          </span>
        </DetailColumn>
        <DetailColumn>
          <Header3>
            {formatAmount(currentTransfer.amount ?? 0)}{' '}
            {currentTransfer.tokenSymbol || currentTransfer.coinSymbol}
          </Header3>
        </DetailColumn>
      </VerticalWrapper>
      <VerticalWrapper>
        <DetailColumn>
          <span style={TextColor} className="ion-text-size-xs">
            {t('Total')}
          </span>
        </DetailColumn>
        <DetailColumn style={{ display: 'flex', flexDirection: 'column' }}>
          {isTransactionL2 ? (
            <Header3>
              {formatAmount(currentTransfer.amount ?? 0)}{' '}
              {currentTransfer.tokenSymbol || currentTransfer.coinSymbol}
            </Header3>
          ) : (
            <>
              <Header3 style={{ width: '100%', textAlign: 'right' }}>
                {currentTransfer.amount ?? 0} {currentTransfer.tokenSymbol}
              </Header3>
              <span className="ion-text-size-xxs" style={{ color: '#958E99' }}>
                + {currentTransfer.feesPaid} {currentTransfer.coinSymbol}
              </span>
            </>
          )}
        </DetailColumn>
      </VerticalWrapper>
    </HorizontalWrapper>
  );
};
const DepositDetails = ({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) => {
  const { t } = useTranslation();
  return (
    <HorizontalWrapper>
      <Header3>{t('Deposit')}</Header3>
      <VerticalWrapper>
        <DetailColumn>
          <span className="ion-text-size-xs" style={TextColor}>
            {t('Total')}
          </span>
        </DetailColumn>
        <DetailColumn>
          <Header3>
            {currentTransfer.amount +
              ' ' +
              (currentTransfer.tokenSymbol || currentTransfer.coinSymbol)}
          </Header3>
        </DetailColumn>
      </VerticalWrapper>
    </HorizontalWrapper>
  );
};
