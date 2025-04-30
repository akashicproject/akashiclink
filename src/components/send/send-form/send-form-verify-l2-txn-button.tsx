import { FeeDelegationStrategy } from '@helium-pay/backend';
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../redux/app/hooks';
import { selectFocusCurrencyDetail } from '../../../redux/slices/preferenceSlice';
import { useFocusCurrencySymbolsAndBalances } from '../../../utils/hooks/useAggregatedBalances';
import { useVerifyTxnAndSign } from '../../../utils/hooks/useVerifyTxnAndSign';
import type { FormAlertState } from '../../common/alert/alert';
import { errorAlertShell } from '../../common/alert/alert';
import { PrimaryButton } from '../../common/buttons';
import { SendFormContext } from '../send-form-trigger-button';
import type { ValidatedAddressPair } from './types';

type SendFormVerifyL2TxnButtonProps = {
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
  disabled: boolean;
  onAddressReset: () => void;
  setAlert: Dispatch<SetStateAction<FormAlertState>>;
};

export const SendFormVerifyL2TxnButton: FC<SendFormVerifyL2TxnButtonProps> = ({
  validatedAddressPair,
  amount,
  disabled,
  onAddressReset,
  setAlert,
}) => {
  const { t } = useTranslation();
  const { nativeCoinSymbol } = useFocusCurrencySymbolsAndBalances();
  const { chain, token } = useAppSelector(selectFocusCurrencyDetail);
  const { setStep, setSendConfirm, step } = useContext(SendFormContext);

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
        FeeDelegationStrategy.None
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

  return (
    <PrimaryButton
      expand="block"
      className={'w-100'}
      onClick={onConfirm}
      disabled={isLoading || disabled}
      isLoading={isLoading}
    >
      {t('Next')}
    </PrimaryButton>
  );
};
