import './activity.scss';

import { TransactionLayer, TransactionType } from '@helium-pay/backend';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { Divider } from '../common/divider';
import { List } from '../common/list/list';
import { ListLabelValueItem } from '../common/list/list-label-value-item';
import { BaseDetails } from './base-details';

export function TransactionDetails({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) {
  return (
    <>
      <BaseDetails currentTransfer={currentTransfer} />
      <Divider style={{ width: '100%' }} className={'ion-margin-vertical'} />
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
  const isL2 = currentTransfer.layer === TransactionLayer.L2;

  const precision = !isL2 || !currentTransfer.tokenSymbol ? 6 : 2;

  const currencySymbol =
    currentTransfer.currency?.token ?? currentTransfer.currency?.displayName;

  // Calculate total Amount
  const totalAmount = Big(currentTransfer.amount);
  const totalFee = Big(currentTransfer?.feesPaid ?? '0');

  const internalFee = Big(currentTransfer.internalFee?.deposit ?? '0').add(
    currentTransfer.internalFee?.withdraw ?? '0'
  );
  const totalAmountWithFee = totalAmount.add(internalFee);

  return (
    <List lines="none">
      <h3 className="ion-text-align-left ion-margin-0">{t('Send')}</h3>
      <ListLabelValueItem
        label={t('Amount')}
        value={`${totalAmount.toFixed(precision)} ${currencySymbol}`}
        valueSize={'md'}
        valueBold
      />
      <ListLabelValueItem
        label={t(isL2 ? 'Fee' : 'GasFee')}
        value={`${
          isL2 ? internalFee.toFixed(precision) : totalFee.toFixed(precision)
        } ${isL2 ? currencySymbol : currentTransfer.currency?.chain}`}
        valueSize={'md'}
        valueBold
      />
      <ListLabelValueItem
        label={t('Total')}
        value={`${
          isL2
            ? totalAmountWithFee.toFixed(precision)
            : totalAmount.toFixed(precision)
        } ${currencySymbol}`}
        remark={
          isL2
            ? undefined
            : `+${totalFee.toFixed(precision)} ${
                currentTransfer.currency?.chain
              }`
        }
        valueSize={'md'}
        valueBold
      />
    </List>
  );
};
const DepositDetails = ({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) => {
  const { t } = useTranslation();
  return (
    <List lines="none">
      <h3 className="ion-text-align-left ion-margin-0">{t('Deposit')}</h3>
      <ListLabelValueItem
        label={t('Total')}
        value={`${currentTransfer.amount} ${
          currentTransfer.tokenSymbol ?? currentTransfer.coinSymbol
        }`}
        valueSize={'md'}
        valueBold
      />
    </List>
  );
};
