import { IonCol, IonRow } from '@ionic/react';
import Big from 'big.js';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import { displayLongText } from '../../../utils/long-text';
import type { FormAlertState } from '../../common/alert/alert';
import { List } from '../../common/list/list';
import { ListLabelValueAmountItem } from '../../common/list/list-label-value-amount-item';
import { ListLabelValueItem } from '../../common/list/list-label-value-item';
import { SendFormVerifyL2TxnButton } from './send-form-verify-l2-txn-button';
import type { ValidatedAddressPair } from './types';

export const SendL2TxnDetailBox = ({
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
              <ListLabelValueAmountItem
                label={t('Fee')}
                value={fee}
                amount={amount}
                fee={fee}
              />
              <ListLabelValueAmountItem
                label={t('Total')}
                value={Big(fee ?? '0')
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
