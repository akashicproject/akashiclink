import {
  type CoinSymbol,
  type CryptoCurrencySymbol,
  FeeDelegationStrategy,
} from '@akashic/as-backend';
import styled from '@emotion/styled';
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../utils/hooks/useConfig';
import { useVerifyTxnAndSign } from '../../utils/hooks/useVerifyTxnAndSign';
import type { FormAlertState } from '../common/alert/alert';
import { errorAlertShell } from '../common/alert/alert';
import { PrimaryButton } from '../common/buttons';
import { AddressScreeningContext } from './address-screening-new-scan-modal';
import type { ValidatedScanAddress } from './types';

const StyledPrimaryButton = styled(PrimaryButton)`
  ::part(native) {
    font-size: 12px;
    height: 32px;
  }
`;

export const AddressScreeningFormVerifyTxnButton: FC<{
  validatedScanAddress: ValidatedScanAddress;
  disabled: boolean;
  onAddressReset: () => void;
  setAlert: Dispatch<SetStateAction<FormAlertState>>;
  chain: CoinSymbol;
  token?: CryptoCurrencySymbol;
}> = ({
  validatedScanAddress,
  disabled,
  onAddressReset,
  setAlert,
  chain,
  token,
}) => {
  const { t } = useTranslation();

  const { config, isLoading: isLoadingConfig } = useConfig();
  const { setStep, setAddressScanConfirm } = useContext(
    AddressScreeningContext
  );

  const [isLoading, setIsLoading] = useState(false);

  const verifyTxnAndSign = useVerifyTxnAndSign();

  const onConfirm = async () => {
    try {
      setIsLoading(true);

      if (!config) {
        setAlert(errorAlertShell('GenericFailureMsg'));
        return;
      }

      const res = await verifyTxnAndSign(
        {
          convertedToAddress:
            config?.addressScreeningFeeCollectorIdentity ?? '',
          userInputToAddress:
            config?.addressScreeningFeeCollectorIdentity ?? '',
          userInputToAddressType: 'l2',
          isL2: true,
        },
        config?.addressScreeningFee ?? '',
        chain,
        token,
        FeeDelegationStrategy.None
      );
      if (typeof res === 'string') {
        setAlert(errorAlertShell(res));
        return;
      }

      // once user leave this page, reset the form
      onAddressReset();
      setAddressScanConfirm({
        txn: res.txn,
        signedTxn: res.signedTxn,
        validatedScanAddress: {
          ...validatedScanAddress,
          feeChain: chain,
          feeToken: token,
        },
      });
      setStep(1);
    } catch {
      setAlert(errorAlertShell('GenericFailureMsg'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledPrimaryButton
      expand="block"
      className={'w-100'}
      onClick={onConfirm}
      disabled={isLoading || isLoadingConfig || disabled}
      isLoading={isLoading || isLoadingConfig}
    >
      {t('Scan')}
    </StyledPrimaryButton>
  );
};
