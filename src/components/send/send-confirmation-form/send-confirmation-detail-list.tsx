import { NetworkDictionary } from '@helium-pay/backend';
import { IonItem, IonText } from '@ionic/react';
import Big from 'big.js';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { getPrecision } from '../../../utils/formatAmount';
import { useCryptoCurrencySymbolsAndBalances } from '../../../utils/hooks/useCryptoCurrencySymbolsAndBalances';
import { useInterval } from '../../../utils/hooks/useInterval';
import { useTxnPresigned } from '../../../utils/hooks/useTxnPresigned';
import { ShareActionButton } from '../../activity/share-action-button';
import { L2Icon } from '../../common/chain-icon/l2-icon';
import { NetworkIcon } from '../../common/chain-icon/network-icon';
import { Divider } from '../../common/divider';
import { List } from '../../common/list/list';
import { ListLabelValueItem } from '../../common/list/list-label-value-item';
import { ListVerticalLabelValueItem } from '../../common/list/list-vertical-label-value-item';
import { ListCopyTxHashItem } from '../copy-tx-hash';
import { FromToAddressBlock } from '../from-to-address-block';
import { QueuedChip } from '../queued-chip';
import { SendFormContext } from '../send-modal-context-provider';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const SendConfirmationDetailList = () => {
  const { t } = useTranslation();
  const { sendConfirm, currency } = useContext(SendFormContext);
  const { isCurrencyTypeToken, currencySymbol, nativeCoinSymbol } =
    useCryptoCurrencySymbolsAndBalances(currency);
  const { chain } = currency;

  const { data: signedL1Txn, trigger } = useTxnPresigned();

  const txn = sendConfirm?.txn;
  const txnFinal = sendConfirm?.txnFinal;
  const validatedAddressPair = sendConfirm?.validatedAddressPair;
  const delegatedFee = sendConfirm?.delegatedFee;

  const isL2 = validatedAddressPair?.isL2;

  // Calculate total Amount
  const totalFee = txnFinal?.feesEstimate
    ? Big(txnFinal?.feesEstimate)
    : Big(txn?.feesEstimate ?? 0);
  const internalFee = Big(txn?.internalFee?.withdraw ?? 0);
  const totalAmountWithFee = Big(txn?.amount ?? '0')
    .add(internalFee)
    .add(isCurrencyTypeToken ? Big(0) : totalFee);

  const feeForPrecision = totalFee.gt(0)
    ? totalFee.toString()
    : internalFee.gt(0)
      ? internalFee.toString()
      : '0';

  const precision = getPrecision(txn?.amount ?? '0', feeForPrecision);

  const getUrl = (
    type: 'account' | 'transaction',
    isL2: boolean,
    value: string
  ) => {
    if (type === 'account') {
      return isL2
        ? `${process.env.REACT_APP_SCAN_BASE_URL}/accounts/${value}`
        : `${NetworkDictionary[chain].addressUrl}/${value}`;
    }
    // Or if transaction
    return `${process.env.REACT_APP_SCAN_BASE_URL}/transactions/${value}`;
  };

  // If token, displayed as "USDT" for L1 and "USDT (ETH)" for L2 (since
  // deducing the chain the token belongs to is not trivial)
  const currencyDisplayName = isCurrencyTypeToken
    ? currencySymbol + (isL2 ? ` (${nativeCoinSymbol})` : '')
    : nativeCoinSymbol;

  const alias = validatedAddressPair?.alias ?? '-';

  const feeCurrencyDisplayName =
    isCurrencyTypeToken && (isL2 || !!delegatedFee)
      ? currencySymbol + (isL2 ? ` (${nativeCoinSymbol})` : '')
      : nativeCoinSymbol;

  // Presigned L1 txn returns presignedUmid instead of l2 tx hash
  // Periodically fetches L2 txHash with presignedUmid
  useInterval(() => {
    if (!txnFinal?.isPresigned || !txnFinal?.txHash || !!signedL1Txn?.l2TxnHash)
      return;

    trigger({
      preSignedUmid: txnFinal?.txHash ?? '',
    });
  }, 1000);

  const txHash = txnFinal?.isPresigned
    ? signedL1Txn?.l2TxnHash
    : txnFinal?.txHash;

  return (
    <List lines="none">
      <IonItem className={'ion-margin-bottom-xs'}>
        {isL2 ? <L2Icon size={24} /> : <NetworkIcon size={24} chain={chain} />}
        <IonText>
          <h3 className={'ion-text-size-md ion-margin-0 ion-margin-left-xs'}>
            {isL2
              ? t('Chain.AkashicChain')
              : NetworkDictionary[chain].displayName.replace(/Chain/g, '')}
          </h3>
        </IonText>
        {txHash && (
          <div className={'ion-margin-left-auto'}>
            <ShareActionButton
              filename={txHash}
              link={getUrl('transaction', !!isL2, txHash)}
            />
          </div>
        )}
      </IonItem>
      <ListVerticalLabelValueItem
        label={t('InputAddress')}
        value={validatedAddressPair?.userInputToAddress}
      />
      {!txnFinal && (
        <ListVerticalLabelValueItem
          label={t('SendTo')}
          value={validatedAddressPair?.convertedToAddress}
        />
      )}
      {txnFinal && (
        <>
          <IonItem>
            <FromToAddressBlock
              fromAddress={txn?.fromAddress}
              toAddress={txn?.toAddress}
              fromAddressUrl={getUrl(
                'account',
                !!isL2,
                txn?.fromAddress ?? '-'
              )}
              toAddressUrl={getUrl('account', !!isL2, txn?.toAddress ?? '-')}
            />
          </IonItem>
          {txHash && (
            <IonItem>
              <ListCopyTxHashItem
                txHash={txHash}
                txHashUrl={getUrl('transaction', !!isL2, txHash)}
              />
            </IonItem>
          )}
          {!txHash && (
            <ListLabelValueItem label={t('txHash')} value={<QueuedChip />} />
          )}
        </>
      )}
      <IonItem>
        <Divider style={{ width: '100%' }} className={'ion-margin-vertical'} />
      </IonItem>
      <ListLabelValueItem
        label={t('Amount')}
        value={`${Big(txn?.amount ?? '0').toFixed(precision)} ${currencyDisplayName}`}
        valueSize={'md'}
        valueBold
      />
      {isL2 && (
        <ListLabelValueItem
          label={t('L2Fee')}
          value={`${internalFee.toFixed(precision)} ${feeCurrencyDisplayName}`}
          valueSize={'md'}
          valueBold
        />
      )}
      {!isL2 && (
        <ListLabelValueItem
          label={t(delegatedFee ? 'DelegatedGasFee' : 'GasFee')}
          value={`${
            delegatedFee
              ? Big(delegatedFee).toFixed(precision)
              : totalFee.toFixed(precision)
          } ${feeCurrencyDisplayName}`}
          valueSize={'md'}
          valueBold
        />
      )}
      <ListLabelValueItem
        label={t('Total')}
        value={`${totalAmountWithFee.toFixed(
          precision
        )} ${currencyDisplayName}`}
        remark={
          isL2 || !isCurrencyTypeToken || delegatedFee
            ? undefined
            : `+${totalFee.toFixed(precision)} ${nativeCoinSymbol}`
        }
        valueSize={'md'}
        valueBold
      />
      <>
        <IonItem>
          <Divider
            style={{ width: '100%' }}
            className={'ion-margin-vertical'}
          />
        </IonItem>
        <ListLabelValueItem label={t('AkashicAlias')} value={alias} labelBold />
      </>
    </List>
  );
};
