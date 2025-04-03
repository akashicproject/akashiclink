import { L2Regex } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import Big from 'big.js';
import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../../constants/urls';
import { history, historyGoBackOrReplace } from '../../../routing/history';
import { akashicPayPath } from '../../../routing/navigation-tabs';
import { OwnersAPI } from '../../../utils/api';
import { useFocusCurrencySymbolsAndBalances } from '../../../utils/hooks/useAggregatedBalances';
import { useAccountStorage } from '../../../utils/hooks/useLocalAccounts';
import { signTxBody } from '../../../utils/nitr0gen-api';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../common/alert/alert';
import { PurpleButton, WhiteButton } from '../../common/buttons';
import {
  useCacheOtk,
  useFocusCurrencyDetail,
} from '../../providers/PreferenceProvider';
import type { ValidatedAddressPair } from './types';

type SendFormActionButtonsProps = {
  validatedAddressPair: ValidatedAddressPair;
  amount: string;
  disabled: boolean;
  onAddressReset: () => void;
};

export const SendFormActionButtons: FC<SendFormActionButtonsProps> = ({
  validatedAddressPair,
  amount,
  disabled,
  onAddressReset,
}) => {
  const { t } = useTranslation();
  const { activeAccount } = useAccountStorage();
  const { chain, token } = useFocusCurrencyDetail();
  const [cacheOtk, _] = useCacheOtk();
  const { currencyBalance, currencySymbol } =
    useFocusCurrencySymbolsAndBalances();

  const [alert, setAlert] = useState(formAlertResetState);
  const [isLoading, setIsLoading] = useState(false);

  const isL2 = validatedAddressPair.convertedToAddress.match(L2Regex);
  const availableBalance = currencyBalance ?? '0';

  const onConfirm = async () => {
    try {
      setIsLoading(true);

      if (!cacheOtk) {
        setAlert(errorAlertShell(t('GenericFailureMsg')));
        return;
      }

      const txns = await OwnersAPI.verifyTransactionUsingClientSideOtk({
        fromAddress: activeAccount?.identity,
        toAddress: validatedAddressPair.convertedToAddress,
        amount,
        coinSymbol: chain,
        tokenSymbol: token,
        forceL1: !isL2,
      });

      // reject the request if /verify returns multiple transfers
      // for L2: multiple transactions from the same Nitr0gen identity can always be combined into a single one
      if ((!isL2 && txns.length > 1) || txns.length === 0) {
        setAlert(errorAlertShell(t('GenericFailureMsg')));
        return;
      }

      // final check if balance is enough
      if (
        Big(amount).gt(
          Big(availableBalance ?? 0).sub(txns[0].feesEstimate ?? '0')
        )
      ) {
        setAlert(
          errorAlertShell(
            t(isL2 ? 'SavingsExceeded' : 'insufficientBalance', {
              coinSymbol: currencySymbol,
            })
          )
        );
        return;
      }

      // sign txns and move to final confirmation
      const signedTxns = await Promise.all(
        txns
          .filter((res) => typeof res.txToSign !== 'undefined')
          .map((res) => signTxBody(res.txToSign!, cacheOtk))
      );

      // once user leave this page, reset the form
      onAddressReset();
      history.push({
        pathname: akashicPayPath(urls.sendConfirm),
        state: {
          sendConfirm: {
            txns,
            signedTxns,
            validatedAddressPair,
          },
        },
      });
    } catch (e) {
      setAlert(errorAlertShell(t('GenericFailureMsg')));
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    historyGoBackOrReplace();
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
          <PurpleButton
            expand="block"
            className={'w-100'}
            onClick={onConfirm}
            disabled={disabled}
            isLoading={isLoading}
          >
            {t('Next')}
          </PurpleButton>
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
