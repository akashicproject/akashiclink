import { IonCol, IonRow, IonSpinner } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { BorderedBox } from '../components/common/box/border-box';
import { OutlineButton, PrimaryButton } from '../components/common/buttons';
import { List } from '../components/common/list/list';
import { ListVerticalLabelValueItem } from '../components/common/list/list-vertical-label-value-item';
import { PopupLayout } from '../components/page-layout/popup-layout';

export function SignTransactionOrPersonalContent({
  message,
  isProcessingRequest,
  onClickSign,
  onClickReject,
}: {
  message?: Record<string, string>;
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
        >
          {message ? (
            <List lines={'none'}>
              {Object.entries(message).map(([key, value]) => (
                <ListVerticalLabelValueItem
                  key={key}
                  label={t(`Popup.${key}`)}
                  value={value ?? '-'}
                />
              ))}
            </List>
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
            disabled={!message || isProcessingRequest}
            onClick={onClickReject}
          >
            {t('Deny')}
          </OutlineButton>
        </IonCol>
        <IonCol size={'6'}>
          <PrimaryButton
            expand="block"
            isLoading={!message || isProcessingRequest}
            onClick={onClickSign}
          >
            {t('Confirm')}
          </PrimaryButton>
        </IonCol>
      </IonRow>
    </PopupLayout>
  );
}
