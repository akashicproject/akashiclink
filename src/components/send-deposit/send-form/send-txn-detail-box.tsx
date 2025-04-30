import { L2Regex } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import Big from 'big.js';
import { debounce } from 'lodash';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { OwnersAPI } from '../../../utils/api';
import { getPrecision } from '../../../utils/formatAmount';
import { useFocusCurrencySymbolsAndBalances } from '../../../utils/hooks/useAggregatedBalances';
import { displayLongText } from '../../../utils/long-text';
import type { FormAlertState } from '../../common/alert/alert';
import { List } from '../../common/list/list';
import { ListLabelValueAmountItem } from '../../common/list/list-label-value-amount-item';
import { ListLabelValueItem } from '../../common/list/list-label-value-item';
import { SendFormVerifyL2TxnButton } from './send-form-verify-l2-txn-button';
import type { ValidatedAddressPair } from './types';

export const SendTxnDetailBox = ({
  validatedAddressPair,
  amount,
  fee,
  disabled,
  setAlert,
  onAddressReset,
}: {
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
  fee: string;
  disabled: boolean;
  setAlert: Dispatch<SetStateAction<FormAlertState>>;
  onAddressReset: () => void;
}) => {
  const { t } = useTranslation();
  const { chain, nativeCoinBalance } = useFocusCurrencySymbolsAndBalances();
  const [networkFee, setNetworkFee] = useState<string | null>(null);

  const fetchNetworkFee = useCallback(
    debounce(async () => {
      const feeResponse = await OwnersAPI.estimateNetworkFees({
        toAddress: validatedAddressPair.convertedToAddress,
        amount,
        coinSymbol: chain,
      });
      setNetworkFee(feeResponse.networkFee);
    }, 500),
    [validatedAddressPair, amount, chain]
  );

  useEffect(() => {
    fetchNetworkFee();
    return () => {
      fetchNetworkFee.cancel(); // Cleanup function to cancel pending calls
    };
  }, [fetchNetworkFee]);

  const canNonDelegate = Big(nativeCoinBalance).gt(networkFee ?? 0);
  const precision = getPrecision(amount, networkFee ?? '0');

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
                    Big(networkFee ?? 0).eq(0)
                      ? '-'
                      : canNonDelegate
                        ? Big(networkFee ?? '0').toFixed(precision)
                        : t('InsufficientBalance')
                  }
                  valueDim
                  labelBold
                />
              )}
              {isL2 && (
                <ListLabelValueAmountItem
                  label={t('Fee')}
                  value={fee}
                  amount={amount}
                  fee={fee}
                />
              )}
              <ListLabelValueAmountItem
                label={t('Total')}
                value={Big(isL2 ? (fee ?? '0') : '0')
                  .add(amount)
                  .toString()}
                amount={amount}
                fee={fee}
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
