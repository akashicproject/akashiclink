import { IonCol, IonRow, IonSpinner } from '@ionic/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { BorderedBox } from '../components/common/box/border-box';
import { PopupLayout } from '../components/page-layout/popup-layout';
import { SendCompleted } from '../components/send/send-confirmation-form/send-completed';
import { SendConfirmationForm } from '../components/send/send-confirmation-form/send-confirmation-form';
import { SendFormContext } from '../components/send/send-modal-context-provider';

export function SendTransactionContent() {
  const { t } = useTranslation();
  const { sendConfirm, step } = useContext(SendFormContext);

  const url = new URL(window.location.href);
  const origin = url.searchParams.get('origin');

  return (
    <PopupLayout>
      <IonRow>
        <IonCol size={'8'} offset={'2'}>
          <BorderedBox lines="full" compact>
            <h4 className="w-100 ion-justify-content-center ion-margin-0">
              {origin ?? '-'}
            </h4>
          </BorderedBox>
        </IonCol>
        <IonCol size={'12'}>
          <h2 className="ion-justify-content-center ion-margin-top-lg ion-margin-bottom-xs">
            {t('SignatureRequest')}
          </h2>
          <p className="ion-justify-content-center ion-margin-bottom-sm ion-text-align-center">
            {t('OnlySignThisMessageIfYouFullyUnderstand')}
          </p>
        </IonCol>
        <IonCol
          size={'12'}
          className={'ion-justify-content-center ion-align-items-center'}
        >
          {sendConfirm ? (
            step === 3 ? (
              <SendCompleted />
            ) : (
              <SendConfirmationForm />
            )
          ) : (
            <IonSpinner
              className={'w-100 ion-margin-top-xl'}
              color="secondary"
              name="circular"
            />
          )}
        </IonCol>
      </IonRow>
    </PopupLayout>
  );
}
