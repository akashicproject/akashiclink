import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { AddressScreeningConfirmationDetailList } from './address-screening-confirmation-detail-list';
import { AddressScreeningConfirmationFormActionButtons } from './address-screening-confirmation-form-action-buttons';
import { AddressScreeningContext } from './address-screening-new-scan-modal';

export const AddressScreeningConfirmationForm = () => {
  const { t } = useTranslation();
  const { addressScanConfirm: txnDetail } = useContext(AddressScreeningContext);

  // check if coming back from send page, and make ts happy
  if (!txnDetail) {
    return null;
  }

  return (
    <IonGrid
      className={
        'ion-grid-gap-xs ion-padding-top-xxs ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
      }
    >
      <IonRow>
        <IonCol className={'ion-text-align-center'} size={'12'}>
          <IonText>
            <h2 className="ion-margin-0">{t('PaymentConfirmation')}</h2>
          </IonText>
        </IonCol>
        <IonCol size={'12'}>
          {txnDetail?.txn && txnDetail?.validatedScanAddress && (
            <AddressScreeningConfirmationDetailList
              txnsDetail={txnDetail}
              validatedScanAddress={txnDetail.validatedScanAddress}
            />
          )}
        </IonCol>
      </IonRow>
      {txnDetail && (
        <AddressScreeningConfirmationFormActionButtons txnsDetail={txnDetail} />
      )}
    </IonGrid>
  );
};
