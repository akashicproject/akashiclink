import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorIconWithTitle } from '../../common/state-icon-with-title/error-icon-with-title';
import { SuccessfulIconWithTitle } from '../../common/state-icon-with-title/successful-icon-with-title';
import { SendFormContext } from '../send-modal-context-provider';
import { SendConfirmationDetailList } from './send-confirmation-detail-list';
import { SendConfirmationFormActionButtons } from './send-confirmation-form-action-buttons';

export const SendConfirmationForm = () => {
  const { t } = useTranslation();
  const { setStep, sendConfirm } = useContext(SendFormContext);

  const txnsDetail = sendConfirm;

  // check if coming back from send page, and make ts happy
  if (!txnsDetail) {
    setStep(0);
    return null;
  }

  return (
    <IonGrid
      className={
        'ion-grid-gap-xs ion-padding-top-xxs ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
      }
    >
      <IonRow>
        <IonCol size={'12'}>
          {sendConfirm?.txnFinal?.txHash && (
            <SuccessfulIconWithTitle
              size={24}
              isHorizontal
              title={t('TransactionSuccessful')}
            />
          )}
          {sendConfirm?.txnFinal?.error && (
            <ErrorIconWithTitle
              size={24}
              isHorizontal
              title={t('TransactionFailed')}
            />
          )}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size={'12'}>
          {txnsDetail?.txn && txnsDetail?.validatedAddressPair && (
            <SendConfirmationDetailList />
          )}
        </IonCol>
      </IonRow>
      <SendConfirmationFormActionButtons />
    </IonGrid>
  );
};
