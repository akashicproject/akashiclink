import type { IBaseAcTransaction } from '@helium-pay/backend';
import { otherError } from '@helium-pay/backend';
import { IonAlert, IonCol, IonRow } from '@ionic/react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { historyGo } from '../../routing/history';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { usePayToScreen } from '../../utils/hooks/usePayToScreen';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../common/alert/alert';
import { PrimaryButton, WhiteButton } from '../common/buttons';
import { AddressScreeningContext } from './address-screening-new-scan-modal';
import { type AddressScanConfirmationTxnsDetail } from './types';

export const AddressScreeningConfirmationFormActionButtons = ({
  txnsDetail,
}: {
  txnsDetail: AddressScanConfirmationTxnsDetail;
}) => {
  const { t } = useTranslation();
  const { trigger } = usePayToScreen();
  const { activeAccount } = useAccountStorage();

  const { setStep, setAddressScanConfirm, setIsModalOpen } = useContext(
    AddressScreeningContext
  );
  const [forceAlert, setForceAlert] = useState(formAlertResetState);
  const [formAlert, setFormAlert] = useState(formAlertResetState);
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setFormAlert(formAlertResetState);

      if (
        !activeAccount?.identity ||
        !txnsDetail.txn ||
        !txnsDetail.signedTxn ||
        !txnsDetail.validatedScanAddress?.scanAddress ||
        !txnsDetail.validatedScanAddress?.scanChain
      ) {
        setFormAlert(errorAlertShell('GenericFailureMsg'));
        return;
      }
      setIsLoading(true);

      const response = await trigger({
        ownerIdentity: activeAccount?.identity as `AS${string}`,
        addressToScreen: txnsDetail.validatedScanAddress.scanAddress,
        screenCoinSymbol: txnsDetail.validatedScanAddress.scanChain,
        signedPaymentTx: txnsDetail.signedTxn as IBaseAcTransaction,
      });

      historyGo(urls.addressScreeningDetails, {
        addressScreeningSearch: {
          id: response._id,
        },
      });
      setIsModalOpen(false);
    } catch (error) {
      const errorShell = errorAlertShell(unpackRequestErrorMessage(error));
      if (
        [otherError.signingError, otherError.providerError].includes(
          (error as Error).message
        )
      ) {
        setFormAlert(errorShell);
      } else {
        setForceAlert(errorShell);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    setStep(0);
    setAddressScanConfirm(undefined);
  };

  return (
    <>
      <IonAlert
        isOpen={forceAlert.visible}
        header={t('GenericFailureMsg')}
        message={t(forceAlert.message)}
        backdropDismiss={false}
        buttons={[
          {
            text: t('OK'),
            role: 'confirm',
            handler: async () => {
              setStep(0);
              setAddressScanConfirm(undefined);
              setIsModalOpen(false);
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
      <IonRow>
        <IonCol size={'6'}>
          <PrimaryButton
            isLoading={isLoading}
            onClick={onConfirm}
            expand="block"
          >
            {t('Confirm')}
          </PrimaryButton>
        </IonCol>
        <IonCol size={'6'}>
          <WhiteButton disabled={isLoading} onClick={onCancel} expand="block">
            {t('GoBack')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </>
  );
};
