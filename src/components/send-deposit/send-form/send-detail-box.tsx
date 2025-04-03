import { L2Regex } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';

import { displayLongText } from '../../../utils/long-text';
import { L2Icon } from '../../common/chain-icon/l2-icon';
import { NetworkIcon } from '../../common/chain-icon/network-icon';
import { List } from '../../common/list/list';
import { ListLabelValueItem } from '../../common/list/list-label-value-item';
import { useFocusCurrencyDetail } from '../../providers/PreferenceProvider';
import type { ValidatedAddressPair } from './types';

export const SendDetailBox = ({
  validatedAddressPair,
  amount,
  fee,
  currencySymbol,
}: {
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
  fee: string;
  currencySymbol: string;
}) => {
  const { t } = useTranslation();
  const { chain, token } = useFocusCurrencyDetail();

  const isL2 = !!validatedAddressPair.convertedToAddress?.match(L2Regex);
  const isCurrencyTypeToken = typeof token !== 'undefined';

  const precision = !isL2 || !isCurrencyTypeToken ? 6 : 2;

  return (
    <IonRow className={'ion-grid-row-gap-sm'}>
      <IonCol size={'12'}>
        <List lines="none" bordered compact>
          {isL2 &&
            validatedAddressPair.convertedToAddress !==
              validatedAddressPair.userInputToAddress && (
              <ListLabelValueItem
                label={t('AkashicAddress')}
                value={displayLongText(validatedAddressPair.convertedToAddress)}
                labelBold
              />
            )}
          <ListLabelValueItem
            label={t('Chain.Title')}
            value={isL2 ? <L2Icon /> : <NetworkIcon chain={chain} />}
            labelBold
          />
          <ListLabelValueItem
            label={t(isL2 ? 'Fee' : 'GasFee')}
            value={
              isL2
                ? `${Big(fee).toFixed(precision)} ${currencySymbol}`
                : t('CalculateOnNextStep')
            }
            labelBold
          />
          <ListLabelValueItem
            label={t('Total')}
            value={`${Big(isL2 ? fee : '0')
              .add(amount)
              .toFixed(precision)} ${currencySymbol}`}
            labelBold
          />
        </List>
      </IonCol>
    </IonRow>
  );
};
