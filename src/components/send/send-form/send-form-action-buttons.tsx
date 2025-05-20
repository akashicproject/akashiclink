import { FeeDelegationStrategy } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import { type FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCryptoCurrencySymbolsAndBalances } from '../../../utils/hooks/useCryptoCurrencySymbolsAndBalances';
import { useVerifyTxnAndSign } from '../../../utils/hooks/useVerifyTxnAndSign';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../common/alert/alert';
import { PrimaryButton, WhiteButton } from '../../common/buttons';
import { SendFormContext } from '../send-modal-context-provider';
import type { ValidatedAddressPair } from './types';

type SendFormActionButtonsProps = {
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
  disabled: boolean;
  isDelegated: boolean;
  onAddressReset: () => void;
};

export const SendFormActionButtons: FC<SendFormActionButtonsProps> = ({
  validatedAddressPair,
  amount,
  disabled,
  isDelegated,
  onAddressReset,
}) => {
  const { t } = useTranslation();
  const { setStep, setSendConfirm, setIsModalOpen, step, currency } =
    useContext(SendFormContext);
  const { chain, token } = currency;
  const { nativeCoinSymbol } = useCryptoCurrencySymbolsAndBalances(currency);

  const [alert, setAlert] = useState(formAlertResetState);
  const [isLoading, setIsLoading] = useState(false);

  const verifyTxnAndSign = useVerifyTxnAndSign();

  const onConfirm = async () => {
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
      });
    } catch {
      setAlert(errorAlertShell('GenericFailureMsg'));
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    setStep(0);
    setSendConfirm(undefined);
    setIsModalOpen(false);
  };

  return (
    <>
      {alert.visible && (
        <IonRow>
          <IonCol size={'12'}>
            <AlertBox state={alert} />
          </IonCol>
        </IonRow>
      )}
      <IonRow>
        <IonCol size={'6'}>
          <PrimaryButton
            expand="block"
            className={'w-100'}
            onClick={onConfirm}
            disabled={isLoading || disabled}
            isLoading={isLoading}
          >
            {t('Next')}
          </PrimaryButton>
        </IonCol>
        <IonCol size={'6'}>
          <WhiteButton
            disabled={isLoading}
            className={'w-100'}
            expand="block"
            onClick={onCancel}
          >
            {t('Cancel')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </>
  );
};
