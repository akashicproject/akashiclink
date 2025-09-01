import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../common/buttons';
import { ErrorIconWithTitle } from '../../common/state-icon-with-title/error-icon-with-title';
import { SuccessfulIconWithTitle } from '../../common/state-icon-with-title/successful-icon-with-title';
import { SendFormContext } from '../send-modal-context-provider';
import { SendCompletedDetailList } from './send-completed-detail-list';

export const SendCompleted = () => {
  const { t } = useTranslation();
  const { setStep, sendConfirm, setSendConfirm, setIsModalOpen } =
    useContext(SendFormContext);

  const txnsDetail = sendConfirm;

  // check if coming back from send page, and make ts happy
  if (!txnsDetail?.txnFinal) {
    setStep(0);
    return null;
  }

  const onFinish = () => {
    setStep(0);
    setSendConfirm(undefined);
    setIsModalOpen(false);
  };

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
            <SendCompletedDetailList />
          )}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size={'12'}>
          <PrimaryButton onClick={onFinish} expand="block">
            {t('OK')}
          </PrimaryButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
