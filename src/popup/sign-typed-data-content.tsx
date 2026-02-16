import { IonCol, IonRow, IonSpinner } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { BorderedBox } from '../components/common/box/border-box';
import { OutlineButton, PrimaryButton } from '../components/common/buttons';
import { PopupLayout } from '../components/page-layout/popup-layout';
import type { ITypedData } from './sign-typed-data';
import { TypedDataViewer } from './typed-data-viewer';

export function SignTypedDataContent({
  typedData,
  isProcessingRequest,
  onClickSign,
  onClickReject,
}: {
  typedData?: ITypedData;
  isProcessingRequest: boolean;
  onClickSign: () => Promise<void>;
  onClickReject: () => Promise<void>;
}) {
  const { t } = useTranslation();

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
          style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}
        >
          {typedData ? (
            <TypedDataViewer
              data={typedData.message}
              dataType={typedData.primaryType}
              types={typedData.types}
              label={typedData.primaryType}
            />
          ) : (
            <IonSpinner
              className={'w-100 ion-margin-top-xl'}
              color="secondary"
              name="circular"
            />
          )}
        </IonCol>
      </IonRow>
      <IonRow className={'ion-margin-top-auto'}>
        <IonCol size={'6'}>
          <OutlineButton
            expand="block"
            disabled={!typedData || isProcessingRequest}
            onClick={onClickReject}
          >
            {t('Deny')}
          </OutlineButton>
        </IonCol>
        <IonCol size={'6'}>
          <PrimaryButton
            expand="block"
            isLoading={!typedData || isProcessingRequest}
            onClick={onClickSign}
          >
            {t('Confirm')}
          </PrimaryButton>
        </IonCol>
      </IonRow>
    </PopupLayout>
  );
}
