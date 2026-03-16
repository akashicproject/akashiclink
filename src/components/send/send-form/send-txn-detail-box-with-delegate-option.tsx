import { FeeDelegationStrategy } from '@akashic/as-backend';
import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import Big from 'big.js';
import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { getPrecision } from '../../../utils/formatAmount';
import { useCryptoCurrencySymbolsAndBalances } from '../../../utils/hooks/useCryptoCurrencySymbolsAndBalances';
import { useEstimatedNetworkFee } from '../../../utils/hooks/useEstimatedNetworkFee';
import { useVerifyTxnAndSign } from '../../../utils/hooks/useVerifyTxnAndSign';
import { errorAlertShell, type FormAlertState } from '../../common/alert/alert';
import { WhiteButton } from '../../common/buttons';
import { Divider } from '../../common/divider';
import { List } from '../../common/list/list';
import { ListLabelValueAmountItem } from '../../common/list/list-label-value-amount-item';
import { ListLabelValueItem } from '../../common/list/list-label-value-item';
import { Tooltip } from '../../common/tooltip';
import { SendFormContext } from '../send-modal-context-provider';
import type { ValidatedAddressPair } from './types';

const StyledWhiteButton = styled(WhiteButton)<{
  backgroundColor?: string;
  isLongText?: boolean;
}>`
  ::part(native) {
    font-size: ${(props) => (props.isLongText ? '11px' : '14px')};
    height: 40px;
    padding-left: 6px;
    padding-right: 6px;
  }
`;

export const SendTxnDetailBoxWithDelegateOption = ({
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
  const { setStep, setSendConfirm, step, currency } =
    useContext(SendFormContext);

  const {
    isCurrencyTypeToken,
    nativeCoinBalance,
    nativeCoinSymbol,
    chain,
    token,
    delegatedFee,
  } = useCryptoCurrencySymbolsAndBalances(currency);

  const canDelegate = isCurrencyTypeToken;
  const [isLoading, setIsLoading] = useState(false);
  const verifyTxnAndSign = useVerifyTxnAndSign();

  const estimatedNetworkFee = useEstimatedNetworkFee({
    validatedAddressPair,
    amount: amount === '' ? '0' : amount,
  });

  const canNonDelegate = Big(nativeCoinBalance).gt(estimatedNetworkFee ?? 0);
  const precision = getPrecision(amount, estimatedNetworkFee ?? '0');

  const onConfirm = (isDelegated: boolean) => async () => {
    try {
      setIsLoading(true);

      const res = await verifyTxnAndSign(
        validatedAddressPair,
        amount,
        chain,
        token,
        isDelegated
          ? FeeDelegationStrategy.Delegate
          : FeeDelegationStrategy.None
      );
      if (typeof res === 'string') {
        setAlert(
          errorAlertShell(res, {
            coinSymbol: nativeCoinSymbol,
          })
        );
        return;
      }

      // once user leave this page, reset the form
      onAddressReset();
      setStep(step + 1);
      setSendConfirm({
        txn: res.txn,
        signedTxn: res.signedTxn,
        delegatedFee: res.delegatedFee,
        validatedAddressPair,
        amount,
        feeDelegationStrategy: isDelegated
          ? FeeDelegationStrategy.Delegate
          : FeeDelegationStrategy.None,
      });
    } catch {
      setAlert(errorAlertShell('GenericFailureMsg'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonRow className={'ion-grid-row-gap-sm'}>
      <IonCol size={'12'}>
        <List lines="none" bordered compact>
          <IonRow className={'ion-grid-gap-xxs'}>
            <IonCol size={'8'}>
              {validatedAddressPair.alias && (
                <ListLabelValueItem
                  label={t('AkashicAlias')}
                  value={validatedAddressPair.alias}
                  labelBold
                />
              )}
              <ListLabelValueAmountItem
                label={
                  <div
                    className={'ion-align-items-center'}
                    style={{ display: 'inline-flex' }}
                  >
                    <span>{t('DelegatedGasFee')}</span>
                    <Tooltip content={t('DelegatedFeeDetail')} />
                  </div>
                }
                value={Big(delegatedFee).toString()}
                amount={amount}
                fee={delegatedFee}
                valueShorten
              />
              <ListLabelValueAmountItem
                label={t('Total')}
                value={Big(amount).add(delegatedFee).toString()}
                amount={amount}
                fee={delegatedFee}
                valueShorten
              />
            </IonCol>
            <IonCol size={'4'} className={'ion-center'}>
              <StyledWhiteButton
                expand="block"
                className={'w-100 ion-margin-right-xxs'}
                onClick={onConfirm(true)}
                disabled={isLoading || disabled || !canDelegate}
                isLoading={isLoading}
                // Use NonDelegated string to check for length so that both strings have the same font size
                // and it looks better
                isLongText={t('NonDelegated').length > 10}
              >
                {!isLoading ? t('Delegated') : ''}
              </StyledWhiteButton>
            </IonCol>
          </IonRow>
          <Divider className={'ion-margin-left-xxs ion-margin-right-xxs'} />
          <IonRow className={'ion-grid-gap-xxs'}>
            <IonCol size={'8'}>
              {validatedAddressPair.alias && (
                <ListLabelValueItem
                  label={t('AkashicAlias')}
                  value={validatedAddressPair.alias}
                  labelBold
                />
              )}
              <ListLabelValueItem
                label={t('GasFee')}
                value={
                  Big(estimatedNetworkFee ?? 0).eq(0)
                    ? '-'
                    : canNonDelegate
                      ? `${Big(estimatedNetworkFee ?? '0').toFixed(precision)} ${nativeCoinSymbol}`
                      : t('InsufficientBalance')
                }
                labelBold
                valueShorten
              />
              <ListLabelValueAmountItem
                label={t('Total')}
                value={amount}
                amount={amount}
                fee={delegatedFee}
                valueShorten
              />
            </IonCol>
            <IonCol size={'4'} className={'ion-center'}>
              <StyledWhiteButton
                expand="block"
                className={'w-100 ion-margin-right-xxs'}
                onClick={onConfirm(false)}
                disabled={isLoading || disabled || !canNonDelegate}
                isLoading={isLoading}
                isLongText={t('NonDelegated').length > 10}
              >
                {!isLoading ? t('NonDelegated') : ''}
              </StyledWhiteButton>
            </IonCol>
          </IonRow>
        </List>
      </IonCol>
    </IonRow>
  );
};
