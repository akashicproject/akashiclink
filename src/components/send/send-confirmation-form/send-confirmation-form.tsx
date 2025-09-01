import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

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
          <h2
            className={`ion-text-align-center ion-text-size-md ion-margin-bottom-0 ion-margin-top-sm`}
          >
            {t('TransactionSummary')}
          </h2>
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
