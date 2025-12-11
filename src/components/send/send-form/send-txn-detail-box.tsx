import { L2Regex } from '@akashic/as-backend';
import { IonCol, IonRow } from '@ionic/react';
import Big from 'big.js';
import { type Dispatch, type SetStateAction, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { getPrecision } from '../../../utils/formatAmount';
import { useCryptoCurrencySymbolsAndBalances } from '../../../utils/hooks/useCryptoCurrencySymbolsAndBalances';
import { useEstimatedNetworkFee } from '../../../utils/hooks/useEstimatedNetworkFee';
import { useCalculateCurrencyL2WithdrawalFee } from '../../../utils/hooks/useExchangeRates';
import { displayLongText } from '../../../utils/long-text';
import type { FormAlertState } from '../../common/alert/alert';
import { List } from '../../common/list/list';
import { ListLabelValueAmountItem } from '../../common/list/list-label-value-amount-item';
import { ListLabelValueItem } from '../../common/list/list-label-value-item';
import { SendFormContext } from '../send-modal-context-provider';
import { SendFormVerifyL2TxnButton } from './send-form-verify-l2-txn-button';
import type { ValidatedAddressPair } from './types';

export const SendTxnDetailBox = ({
  validatedAddressPair,
  amount,
  disabled,
  setAlert,
  onAddressReset,
}: {
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
  disabled: boolean;
  setAlert: Dispatch<SetStateAction<FormAlertState>>;
  onAddressReset: () => void;
}) => {
  const { t } = useTranslation();
  const { currency } = useContext(SendFormContext);

  const estimatedNetworkFee = useEstimatedNetworkFee({
    validatedAddressPair,
    amount,
  });
  const calculateL2Fee = useCalculateCurrencyL2WithdrawalFee(
    currency.coinSymbol,
    currency.tokenSymbol
  );
  const l2Fee = calculateL2Fee();

  const { nativeCoinBalance, nativeCoinSymbol } =
    useCryptoCurrencySymbolsAndBalances(currency);

  const canNonDelegate = Big(nativeCoinBalance).gt(estimatedNetworkFee ?? 0);
  const precision = getPrecision(amount, estimatedNetworkFee ?? '0');

  const isL2 = L2Regex.exec(validatedAddressPair?.convertedToAddress);

  return (
    <IonRow className={'ion-grid-row-gap-sm'}>
      <IonCol size={'12'}>
        <List lines="none" bordered compact>
          <IonRow className={'ion-grid-gap-xxxs'}>
            <IonCol size={'8'}>
              {validatedAddressPair.alias && (
                <ListLabelValueItem
                  label={t('AkashicAlias')}
                  value={validatedAddressPair.alias}
                  labelBold
                />
              )}
              {validatedAddressPair.convertedToAddress !==
                validatedAddressPair.userInputToAddress && (
                <ListLabelValueItem
                  label={t('AkashicAddress')}
                  value={displayLongText(
                    validatedAddressPair.convertedToAddress
                  )}
                  labelBold
                />
              )}
              {!isL2 && (
                <ListLabelValueItem
                  label={t('GasFee')}
                  value={
                    estimatedNetworkFee === null
                      ? '-'
                      : canNonDelegate
                        ? `${Big(estimatedNetworkFee ?? '0').toFixed(precision)} ${nativeCoinSymbol}`
                        : t('InsufficientBalance')
                  }
                  labelBold
                />
              )}
              {isL2 && (
                <ListLabelValueAmountItem
                  label={t('Fee')}
                  value={l2Fee}
                  amount={amount}
                  fee={l2Fee}
                />
              )}
              <ListLabelValueAmountItem
                label={t('Total')}
                value={Big(isL2 ? (l2Fee ?? '0') : '0')
                  .add(amount)
                  .toString()}
                amount={amount}
                fee={l2Fee}
              />
            </IonCol>
            <IonCol size={'4'} className={'ion-center'}>
              <SendFormVerifyL2TxnButton
                validatedAddressPair={validatedAddressPair}
                amount={amount}
                disabled={disabled}
                setAlert={setAlert}
                onAddressReset={onAddressReset}
              />
            </IonCol>
          </IonRow>
        </List>
      </IonCol>
    </IonRow>
  );
};
