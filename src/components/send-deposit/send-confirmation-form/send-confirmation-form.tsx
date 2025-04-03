import type { IBaseTransaction } from '@activeledger/sdk-bip39';
import type { ITerriTransaction } from '@helium-pay/backend';
import { L2Regex, NetworkDictionary } from '@helium-pay/backend';
import { IonCol, IonGrid, IonItem, IonRow, IonText } from '@ionic/react';
import Big from 'big.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import type { LocationState } from '../../../routing/history';
import {
  historyGoBackOrReplace,
  historyResetStackAndRedirect,
} from '../../../routing/history';
import { OwnersAPI } from '../../../utils/api';
import { useFocusCurrencySymbolsAndBalances } from '../../../utils/hooks/useAggregatedBalances';
import { displayLongText } from '../../../utils/long-text';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../common/alert/alert';
import { PurpleButton, WhiteButton } from '../../common/buttons';
import { L2Icon } from '../../common/chain-icon/l2-icon';
import { NetworkIcon } from '../../common/chain-icon/network-icon';
import { Divider } from '../../common/divider';
import { List } from '../../common/list/list';
import { ListLabelValueItem } from '../../common/list/list-label-value-item';
import { SuccessfulIconWithTitle } from '../../common/state-icon-with-title/successful-icon-with-title';
import { useFocusCurrencyDetail } from '../../providers/PreferenceProvider';
import { ListCopyTxHashItem } from '../copy-tx-hash';
import { FromToAddressBlock } from '../from-to-address-block';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const SendConfirmationForm = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState(formAlertResetState);
  const [isLoading, setIsLoading] = useState(false);
  const [txnHash, setTxnHash] = useState<string | undefined>();
  const { chain } = useFocusCurrencyDetail();
  const { isCurrencyTypeToken, currencySymbol, nativeCoinSymbol } =
    useFocusCurrencySymbolsAndBalances();

  // check if coming back from send page, and make ts happy
  const history = useHistory<LocationState>();
  if (!history.location.state?.sendConfirm) {
    return null;
  }
  const txns = history.location.state?.sendConfirm?.txns;
  const signedTxns = history.location.state?.sendConfirm?.signedTxns;
  const validatedAddressPair =
    history.location.state?.sendConfirm?.validatedAddressPair;

  // Calculate total Amount
  let totalAmount = Big(0);
  let totalFee = Big(0);
  let totalAmountWithFee = Big(0);

  txns?.forEach(({ amount, feesEstimate, internalFee }) => {
    totalAmount = totalAmount.add(amount);
    totalFee = totalFee
      .add(feesEstimate ?? '0')
      .add(internalFee?.withdraw ?? '0');
    totalAmountWithFee = totalAmount.add(totalFee);
  });

  const { txToSign, ...txn } = txns[0];
  const signedTxn = signedTxns[0];
  const isL2 = !!txn.toAddress?.match(L2Regex);

  const precision = !isL2 || !isCurrencyTypeToken ? 6 : 2;

  const onConfirm = async () => {
    try {
      setIsLoading(true);

      const response = isL2
        ? await OwnersAPI.sendL2TransactionUsingClientSideOtk({
            ...txn,
            forceL1: undefined,
            signedTx: signedTxn as IBaseTransaction,
          })
        : await OwnersAPI.sendL1TransactionUsingClientSideOtk([
            {
              ...txn,
              signedTx: signedTxn as ITerriTransaction,
            },
          ]);

      const res = Array.isArray(response) ? response[0] : response;

      if (!res.isSuccess) {
        setAlert(errorAlertShell(res.reason ?? t('GenericFailureMsg')));
        return;
      }

      setTxnHash(res.txHash);
    } catch (e) {
      setAlert(errorAlertShell(t('GenericFailureMsg')));
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    historyGoBackOrReplace();
  };

  const onFinish = () => {
    historyResetStackAndRedirect();
  };

  return (
    <IonGrid className={'ion-grid-gap-sm'} style={{ padding: '8px 16px' }}>
      {txnHash && (
        <IonRow>
          <IonCol size={'12'}>
            <SuccessfulIconWithTitle title={t('TransactionSuccessful')} />
          </IonCol>
        </IonRow>
      )}
      <IonRow>
        <IonCol size={'12'}>
          <List lines="none">
            <IonItem className={'ion-margin-bottom-sm'}>
              {isL2 ? (
                <L2Icon size={32} />
              ) : (
                <NetworkIcon size={32} chain={chain} />
              )}
              <IonText>
                <h3
                  className={'ion-text-size-md ion-margin-0 ion-margin-left-xs'}
                >
                  {isL2
                    ? t('Chain.AkashicChain')
                    : NetworkDictionary[chain].displayName.replace(
                        /Chain/g,
                        ''
                      )}
                </h3>
              </IonText>
            </IonItem>
            <IonItem>
              <FromToAddressBlock
                fromAddress={txn?.fromAddress}
                toAddress={txn?.toAddress}
              />
            </IonItem>
            {txnHash && (
              <IonItem>
                <ListCopyTxHashItem txHash={txnHash} />
              </IonItem>
            )}
            <IonItem>
              <Divider className={'ion-margin-vertical'} />
            </IonItem>
            <ListLabelValueItem
              label={t('Amount')}
              value={`${totalAmount.toFixed(precision)} ${currencySymbol}`}
              valueSize={'md'}
              valueBold
            />
            <ListLabelValueItem
              label={t(isL2 ? 'Fee' : 'GasFee')}
              value={`${totalFee.toFixed(precision)} ${
                isL2 ? currencySymbol : nativeCoinSymbol
              }`}
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
                  : `+${totalFee.toFixed(precision)} ${nativeCoinSymbol}`
              }
              valueSize={'md'}
              valueBold
            />
            {validatedAddressPair?.convertedToAddress !==
              validatedAddressPair?.userInputToAddress && (
              <>
                <IonItem>
                  <Divider className={'ion-margin-vertical'} />
                </IonItem>
                <ListLabelValueItem
                  label={t('Remark')}
                  value={displayLongText(
                    validatedAddressPair?.userInputToAddress
                  )}
                  labelBold
                />
              </>
            )}
          </List>
        </IonCol>
      </IonRow>
      {alert.visible && (
        <IonRow>
          <IonCol size={'12'}>
            <AlertBox state={alert} />
          </IonCol>
        </IonRow>
      )}
      <IonRow>
        {!txnHash && (
          <>
            <IonCol size={'6'}>
              <PurpleButton
                isLoading={isLoading}
                onClick={onConfirm}
                expand="block"
              >
                {t('Confirm')}
              </PurpleButton>
            </IonCol>
            <IonCol size={'6'}>
              <WhiteButton
                disabled={isLoading}
                onClick={onCancel}
                expand="block"
              >
                {t('GoBack')}
              </WhiteButton>
            </IonCol>
          </>
        )}
        {txnHash && (
          <IonCol size={'12'}>
            <PurpleButton onClick={onFinish} expand="block">
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        )}
      </IonRow>
    </IonGrid>
  );
};
