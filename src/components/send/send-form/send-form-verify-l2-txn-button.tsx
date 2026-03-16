import { FeeDelegationStrategy } from '@akashic/as-backend';
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useCryptoCurrencySymbolsAndBalances } from '../../../utils/hooks/useCryptoCurrencySymbolsAndBalances';
import { useVerifyTxnAndSign } from '../../../utils/hooks/useVerifyTxnAndSign';
import type { FormAlertState } from '../../common/alert/alert';
import { errorAlertShell } from '../../common/alert/alert';
import { PrimaryButton } from '../../common/buttons';
import { SendFormContext } from '../send-modal-context-provider';
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
  const { setStep, setSendConfirm, step, currency } =
    useContext(SendFormContext);
  const { nativeCoinSymbol } = useCryptoCurrencySymbolsAndBalances(currency);
  const { coinSymbol, tokenSymbol } = currency;

  const [isLoading, setIsLoading] = useState(false);

  const verifyTxnAndSign = useVerifyTxnAndSign();

  const executeVerifyL2Txn = async () => {
    try {
      const res = await verifyTxnAndSign(
        validatedAddressPair,
        amount,
        coinSymbol,
        tokenSymbol,
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

  const onConfirm = () => {
    setIsLoading(true);
    executeVerifyL2Txn();
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
