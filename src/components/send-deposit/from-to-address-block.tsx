import { Browser } from '@capacitor/browser';
import { IonIcon, IonLabel, IonText } from '@ionic/react';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { displayLongText } from '../../utils/long-text';

type FromToAddressBlockProps = {
  fromAddress?: string;
  toAddress?: string;
  fromAddressUrl?: string;
  toAddressUrl?: string;
};

export const FromToAddressBlock: FC<FromToAddressBlockProps> = ({
  fromAddress,
  toAddress,
  fromAddressUrl,
  toAddressUrl,
}) => {
  const { t } = useTranslation();

  const onAddressClick = (url: string) => async () => {
    await Browser.open({ url });
  };

  return (
    <div
      className={
        'w-100 ion-display-flex ion-align-items-end ion-justify-content-between'
      }
    >
      <div className={'ion-display-flex ion-flex-1 ion-flex-direction-column'}>
        <IonLabel>
          <b className={'ion-text-size-sm'}>{t('From')}</b>
        </IonLabel>
        <IonText
          onClick={fromAddressUrl ? onAddressClick(fromAddressUrl) : undefined}
        >
          <p className={`${fromAddressUrl ? 'ion-text-underline' : ''}`}>
            {fromAddress ? displayLongText(fromAddress) : '-'}
          </p>
        </IonText>
      </div>
      <div className={'ion-margin-horizontal ion-display-flex'}>
        <IonIcon
          className={'ion-text-size-xxl'}
          color={'grey'}
          icon={arrowForwardCircleOutline}
        />
      </div>
      <div
        className={`ion-display-flex ion-flex-1 ion-flex-direction-column ion-align-items-end`}
      >
        <IonLabel>
          <b className={'ion-text-size-sm'}>{t('To')}</b>
        </IonLabel>
        <IonText
          onClick={toAddressUrl ? onAddressClick(toAddressUrl) : undefined}
        >
          <p className={`${toAddressUrl ? 'ion-text-underline' : ''}`}>
            {toAddress ? displayLongText(toAddress) : '-'}
          </p>
        </IonText>
      </div>
    </div>
  );
};
