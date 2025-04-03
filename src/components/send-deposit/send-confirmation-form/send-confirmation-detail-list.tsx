import {
  type ITransactionVerifyResponse,
  L2Regex,
  NetworkDictionary,
} from '@helium-pay/backend';
import { IonItem, IonText } from '@ionic/react';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { useFocusCurrencySymbolsAndBalances } from '../../../utils/hooks/useAggregatedBalances';
import { displayLongText } from '../../../utils/long-text';
import { L2Icon } from '../../common/chain-icon/l2-icon';
import { NetworkIcon } from '../../common/chain-icon/network-icon';
import { Divider } from '../../common/divider';
import { List } from '../../common/list/list';
import { ListLabelValueItem } from '../../common/list/list-label-value-item';
import { ListVerticalLabelValueItem } from '../../common/list/list-vertical-label-value-item';
import { useFocusCurrencyDetail } from '../../providers/PreferenceProvider';
import { ListCopyTxHashItem } from '../copy-tx-hash';
import { FromToAddressBlock } from '../from-to-address-block';
import type {
  SendConfirmationTxnFinal,
  ValidatedAddressPair,
} from '../send-form/types';

export const SendConfirmationDetailList = ({
  txns,
  txnFinal,
  validatedAddressPair,
}: {
  txns: ITransactionVerifyResponse[];
  txnFinal?: SendConfirmationTxnFinal;
  validatedAddressPair: ValidatedAddressPair;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { t } = useTranslation();

  const { chain } = useFocusCurrencyDetail();
  const { isCurrencyTypeToken, currencySymbol, nativeCoinSymbol } =
    useFocusCurrencySymbolsAndBalances();

  const isL2 = L2Regex.exec(validatedAddressPair?.convertedToAddress);
  const isUserInputAddressL1 = NetworkDictionary[chain].regex.address.exec(
    validatedAddressPair?.userInputToAddress
  );
  const isUserInputAddressL2 = L2Regex.exec(
    validatedAddressPair?.userInputToAddress
  );

  const precision = !isL2 || !isCurrencyTypeToken ? 6 : 2;

  // Calculate total Amount
  const totalAmount =
    txns?.reduce((accm, { amount }) => {
      return accm.add(amount);
    }, Big(0)) ?? Big(0);
  const totalFee = txnFinal?.feesEstimate
    ? Big(txnFinal?.feesEstimate)
    : txns?.reduce(
        (accm, { feesEstimate }) => accm.add(feesEstimate ?? '0'),
        Big(0)
      ) ?? Big(0);
  const internalFee = txns?.reduce(
    (accm, { internalFee }) => accm.add(internalFee?.withdraw ?? '0'),
    Big(0)
  );
  const totalAmountWithFee = totalAmount
    .add(internalFee)
    .add(isCurrencyTypeToken ? Big(0) : totalFee);

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
    return isL2
      ? `${process.env.REACT_APP_SCAN_BASE_URL}/transactions/${value}`
      : `${NetworkDictionary[chain].txnUrl}/${value}`;
  };

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
      </IonItem>
      {isL2 && isUserInputAddressL1 && (
        <ListVerticalLabelValueItem
          label={t('InputAddress')}
          value={validatedAddressPair?.userInputToAddress}
        />
      )}
      {!txnFinal && (
        <ListVerticalLabelValueItem
          label={t('SendTo')}
          value={validatedAddressPair?.convertedToAddress}
        />
      )}
      {txnFinal?.txHash && (
        <>
          <IonItem>
            <FromToAddressBlock
              fromAddress={txns?.[0]?.fromAddress}
              toAddress={txns?.[0]?.toAddress}
              fromAddressUrl={getUrl('account', !!isL2, txns?.[0]?.fromAddress)}
              toAddressUrl={getUrl('account', !!isL2, txns?.[0]?.toAddress)}
            />
          </IonItem>
          <IonItem>
            <ListCopyTxHashItem
              txHash={txnFinal.txHash}
              txHashUrl={getUrl('transaction', !!isL2, txnFinal.txHash)}
            />
          </IonItem>
        </>
      )}
      <IonItem>
        <Divider style={{ width: '100%' }} className={'ion-margin-vertical'} />
      </IonItem>
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
        } ${isL2 ? currencySymbol : nativeCoinSymbol}`}
        valueSize={'md'}
        valueBold
      />
      <ListLabelValueItem
        label={t('Total')}
        value={`${totalAmountWithFee.toFixed(precision)} ${currencySymbol}`}
        remark={
          isL2 || !isCurrencyTypeToken
            ? undefined
            : `+${totalFee.toFixed(precision)} ${nativeCoinSymbol}`
        }
        valueSize={'md'}
        valueBold
      />
      {isL2 && !isUserInputAddressL1 && !isUserInputAddressL2 && (
        <>
          <IonItem>
            <Divider
              style={{ width: '100%' }}
              className={'ion-margin-vertical'}
            />
          </IonItem>
          <ListLabelValueItem
            label={t('Remark')}
            value={displayLongText(validatedAddressPair?.userInputToAddress)}
            labelBold
          />
        </>
      )}
    </List>
  );
};
