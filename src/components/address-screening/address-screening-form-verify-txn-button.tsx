import styled from '@emotion/styled';
import {
  type CoinSymbol,
  type CurrencySymbol,
  FeeDelegationStrategy,
} from '@helium-pay/backend';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { history } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useFocusCurrencySymbolsAndBalances } from '../../utils/hooks/useAggregatedBalances';
import { useVerifyTxnAndSign } from '../../utils/hooks/useVerifyTxnAndSign';
import type { FormAlertState } from '../common/alert/alert';
import { errorAlertShell } from '../common/alert/alert';
import { PrimaryButton } from '../common/buttons';
import type { ValidatedScanAddress } from './types';

const StyledPrimaryButton = styled(PrimaryButton)`
  ::part(native) {
    font-size: 12px;
    height: 32px;
  }
`;

// TODO: 1293 - update this!! probably should get from api / not needed at all
const SCAN_FEE_AMOUNT = '1';
const SCAN_FEE_COLLECTOR_ADDRESS =
  'AScbfdf6faa27a7bbc123fd1b8f6e9e2f28aa5cc146c90fc214065c49e3021e044';

export const AddressScreeningFormVerifyTxnButton: FC<{
  validatedScanAddress: ValidatedScanAddress;
  disabled: boolean;
  onAddressReset: () => void;
  setAlert: Dispatch<SetStateAction<FormAlertState>>;
  chain: CoinSymbol;
  token: CurrencySymbol;
}> = ({
  validatedScanAddress,
  disabled,
  onAddressReset,
  setAlert,
  chain,
  token,
}) => {
  const { t } = useTranslation();
  const { nativeCoinSymbol } = useFocusCurrencySymbolsAndBalances();

  const [isLoading, setIsLoading] = useState(false);

  const verifyTxnAndSign = useVerifyTxnAndSign();

  const onConfirm = async () => {
    try {
      setIsLoading(true);

      const res = await verifyTxnAndSign(
        {
          convertedToAddress: SCAN_FEE_COLLECTOR_ADDRESS,
          userInputToAddress: SCAN_FEE_COLLECTOR_ADDRESS,
          userInputToAddressType: 'l2',
          isL2: true,
        },
        SCAN_FEE_AMOUNT,
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
      history.push({
        pathname: akashicPayPath(urls.addressScreeningNewScanConfirm),
        state: {
          //TODO: 1293 - add in fields returned from endpoint
          addressScanConfirm: {
            txn: res.txn,
            signedTxn: res.signedTxn,
            validatedScanAddress: {
              ...validatedScanAddress,
              feeChain: chain,
              feeToken: token,
            },
          },
        },
      });
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
      disabled={isLoading || disabled}
      isLoading={isLoading}
    >
      {t('Scan')}
    </StyledPrimaryButton>
  );
};
