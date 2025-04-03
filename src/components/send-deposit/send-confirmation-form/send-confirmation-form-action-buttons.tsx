import type { IBaseTransaction } from '@activeledger/sdk-bip39';
import type { ITerriTransaction } from '@helium-pay/backend';
import { L2Regex, otherError } from '@helium-pay/backend';
import { IonAlert, IonCol, IonRow } from '@ionic/react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  historyGoBackOrReplace,
  historyResetStackAndRedirect,
} from '../../../routing/history';
import { OwnersAPI } from '../../../utils/api';
import { useInterval } from '../../../utils/hooks/useInterval';
import { useVerifyTxnAndSign } from '../../../utils/hooks/useVerifyTxnAndSign';
import { unpackRequestErrorMessage } from '../../../utils/unpack-request-error-message';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../common/alert/alert';
import { PurpleButton, WhiteButton } from '../../common/buttons';
import type {
  SendConfirmationTxnFinal,
  SendConfirmationTxnsDetail,
} from '../send-form/types';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const SendConfirmationFormActionButtons = ({
  txnFinal,
  txnsDetail,
  setTxnFinal,
  setTxnsDetail,
}: {
  txnFinal?: SendConfirmationTxnFinal;
  txnsDetail: SendConfirmationTxnsDetail;
  setTxnFinal: Dispatch<SetStateAction<SendConfirmationTxnFinal | undefined>>;
  setTxnsDetail: Dispatch<
    SetStateAction<SendConfirmationTxnsDetail | undefined>
  >;
}) => {
  const { t } = useTranslation();

  const [forceAlert, setForceAlert] = useState(formAlertResetState);
  const [formAlert, setFormAlert] = useState(formAlertResetState);
  const [isLoading, setIsLoading] = useState(false);

  const verifyTxnAndSign = useVerifyTxnAndSign();

  // Re-verify txn every 1 mins
  useInterval(async () => {
    try {
      setIsLoading(true);

      if (forceAlert.visible || formAlert.visible) {
        return;
      }

      if (!txnsDetail.validatedAddressPair || !txnsDetail.amount) {
        setFormAlert(errorAlertShell(t('GenericFailureMsg')));
        return;
      }

      const res = await verifyTxnAndSign(
        txnsDetail.validatedAddressPair,
        txnsDetail.amount
      );

      if (typeof res === 'string') {
        setFormAlert(errorAlertShell(t(res)));
        return;
      }

      setTxnsDetail({
        ...txnsDetail,
        txns: res.txns,
        signedTxns: res.signedTxns,
      });
    } catch (e) {
      setFormAlert(errorAlertShell(t(unpackRequestErrorMessage(e))));
    } finally {
      setIsLoading(false);
    }
  }, 60 * 1000); // 1 mins

  const isL2 = L2Regex.exec(
    txnsDetail?.validatedAddressPair?.convertedToAddress
  );

  const onConfirm = async () => {
    try {
      setFormAlert(formAlertResetState);

      if (!txnsDetail?.txns?.[0] || !txnsDetail?.signedTxns?.[0]) {
        setFormAlert(errorAlertShell(t('GenericFailureMsg')));
        return;
      }
      setIsLoading(true);

      // eslint-disable-next-line no-unsafe-optional-chaining
      const { txToSign, ...txn } = txnsDetail?.txns?.[0];
      const signedTxn = txnsDetail?.signedTxns[0];

      const response = isL2
        ? await OwnersAPI.sendL2TransactionUsingClientSideOtk({
            ...txn,
            forceL1: undefined,
            signedTx: signedTxn as IBaseTransaction,
          })
        : await OwnersAPI.sendL1TransactionUsingClientSideOtk([
            {
              ...txn,
              signedTx: signedTxn as ITerriTransaction,
            },
          ]);

      const res = Array.isArray(response) ? response[0] : response;

      if (!res.isSuccess) {
        throw new Error(res.reason);
      }

      setTxnFinal({
        txHash: res.txHash,
        feesEstimate: res.feesEstimate,
      });
    } catch (error) {
      const errorShell = errorAlertShell(t(unpackRequestErrorMessage(error)));
      if (
        [otherError.signingError, otherError.providerError].includes(
          (error as Error).message
        )
      ) {
        setFormAlert(errorShell);
        setTxnFinal({
          error: unpackRequestErrorMessage(error),
        });
      } else {
        setForceAlert(errorShell);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    historyGoBackOrReplace();
  };

  const onFinish = () => {
    historyResetStackAndRedirect();
  };

  return (
    <>
      <IonAlert
        isOpen={forceAlert.visible}
        header={t('GenericFailureMsg')}
        message={forceAlert.message}
        backdropDismiss={false}
        buttons={[
          {
            text: t('OK'),
            role: 'confirm',
            handler: async () => {
              historyResetStackAndRedirect();
              return false; // make it non dismissable
            },
          },
        ]}
      />
      {formAlert.visible && (
        <IonRow>
          <IonCol size={'12'}>
            <AlertBox state={formAlert} />
          </IonCol>
        </IonRow>
      )}
      {!txnFinal && (
        <IonRow>
          <IonCol size={'6'}>
            <PurpleButton
              isLoading={isLoading}
              onClick={onConfirm}
              expand="block"
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          <IonCol size={'6'}>
            <WhiteButton disabled={isLoading} onClick={onCancel} expand="block">
              {t('GoBack')}
            </WhiteButton>
          </IonCol>
        </IonRow>
      )}
      {txnFinal && (
        <IonRow>
          <IonCol size={'12'}>
            <PurpleButton onClick={onFinish} expand="block">
              {t('OK')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      )}
    </>
  );
};
