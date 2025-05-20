import './activity.scss';

import { TransactionLayer, TransactionType } from '@helium-pay/backend';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { ActivityContainer } from '../../pages/activity/activity-details';
import { getPrecision, isGasFeeAccurate } from '../../utils/formatAmount';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { L2Icon } from '../common/chain-icon/l2-icon';
import { NetworkIcon } from '../common/chain-icon/network-icon';
import { Divider } from '../common/divider';
import { List } from '../common/list/list';
import { ListLabelValueItem } from '../common/list/list-label-value-item';
import { BaseDetails } from './base-details';
import { ShareActionButton } from './share-action-button';

export function TransactionDetails({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) {
  const { t } = useTranslation();

  const chainName =
    currentTransfer.layer === TransactionLayer.L2
      ? t('Chain.AkashicChain')
      : t(`Chain.${currentTransfer.currency?.chain.toUpperCase()}`);

  return (
    <ActivityContainer>
      <div className={'w-100'}>
        <div>
          <div
            className={
              'ion-display-flex ion-align-items-center ion-justify-content-between ion-gap-sm'
            }
          >
            <h2>{t('TransactionDetails')}</h2>
            <ShareActionButton
              filename={currentTransfer.l2TxnHash}
              link={currentTransfer.l2TxnHashUrl}
            />
          </div>
          <div className={'ion-display-flex ion-align-items-center ion-gap-sm'}>
            {currentTransfer.currency?.chain &&
              (currentTransfer.layer === TransactionLayer.L2 ? (
                <L2Icon />
              ) : (
                <NetworkIcon chain={currentTransfer.currency?.chain} />
              ))}
            <span className="ion-text-size-xs" style={{ color: '#958E99' }}>
              {chainName}
            </span>
          </div>
        </div>
      </div>
      <BaseDetails currentTransfer={currentTransfer} />
      <Divider style={{ width: '100%' }} className={'ion-margin-vertical'} />
      {currentTransfer.transferType === TransactionType.DEPOSIT ? (
        <DepositDetails currentTransfer={currentTransfer} />
      ) : (
        <WithdrawDetails currentTransfer={currentTransfer} />
      )}
      {
        <List lines="none">
          <Divider
            style={{ width: '100%' }}
            className={'ion-margin-vertical'}
          />
          <ListLabelValueItem
            label={t('AkashicAlias')}
            value={`${
              currentTransfer.transferType === TransactionType.WITHDRAWAL &&
              currentTransfer.receiverAlias
                ? currentTransfer.receiverAlias
                : '-'
            }`}
            valueSize={'md'}
            valueBold
          />
        </List>
      }
    </ActivityContainer>
  );
}
const WithdrawDetails = ({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { t } = useTranslation();
  const isL2 = currentTransfer.layer === TransactionLayer.L2;

  const gasFee = currentTransfer.feesPaid ?? currentTransfer.feesEstimate;

  const gasFeeIsEstimate =
    !currentTransfer.feesPaid && !!currentTransfer.feesEstimate;

  const precision = getPrecision(
    currentTransfer?.amount,
    gasFee ?? currentTransfer.internalFee?.withdraw ?? '0'
  );

  const gasFeeIsAccurate = isGasFeeAccurate(currentTransfer, precision);

  // Calculate total Amount
  const totalAmount = Big(currentTransfer.amount);
  const totalFee = Big(gasFee ?? '0');

  const internalFee = Big(currentTransfer.internalFee?.withdraw ?? '0');
  const totalAmountWithFee = totalAmount
    .add(internalFee)
    .add(currentTransfer.tokenSymbol ? Big(0) : totalFee);

  // If token, displayed as "USDT" for L1 and "USDT (ETH)" for L2 (since
  // deducing the chain the token belongs to is not trivial)
  const currencyDisplayName = currentTransfer?.currency?.token
    ? currentTransfer?.currency?.token +
      (isL2 ? ` (${currentTransfer.currency.chain})` : '')
    : currentTransfer?.currency?.chain;

  const feeCurrencyDisplayName =
    currentTransfer?.currency?.token && (isL2 || currentTransfer.feeIsDelegated)
      ? currentTransfer?.currency?.token +
        (isL2 ? ` (${currentTransfer.currency.chain})` : '')
      : currentTransfer?.currency?.chain;

  return (
    <List lines="none">
      <h3 className="ion-text-align-left ion-margin-0">{t('Send')}</h3>
      <ListLabelValueItem
        label={t('Amount')}
        value={`${totalAmount.toFixed(precision)} ${currencyDisplayName}`}
        valueSize={'md'}
        valueBold
      />
      <ListLabelValueItem
        label={t(
          isL2
            ? 'L2Fee'
            : currentTransfer.feeIsDelegated
              ? 'DelegatedGasFee'
              : 'GasFee'
        )}
        value={`${
          isL2 || currentTransfer.feeIsDelegated
            ? internalFee.toFixed(precision)
            : (!gasFeeIsAccurate ? '≈' : '') + totalFee.toFixed(precision)
        } ${feeCurrencyDisplayName}${gasFeeIsEstimate ? '*' : ''}`}
        valueSize={'md'}
        valueBold
      />
      <ListLabelValueItem
        label={t('Total')}
        value={`${totalAmountWithFee.toFixed(
          precision
        )} ${currencyDisplayName}`}
        remark={
          isL2 || !currentTransfer.tokenSymbol || currentTransfer.feeIsDelegated
            ? undefined
            : `+${totalFee.toFixed(precision)} ${
                currentTransfer.currency?.chain
              }${gasFeeIsEstimate ? '*' : ''}`
        }
        valueSize={'md'}
        valueBold
      />
      {gasFeeIsEstimate && (
        <ListLabelValueItem
          label={''}
          value={''}
          remark={t('EstimatedGasFeeMessage')}
        />
      )}
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
