import { Clipboard } from '@capacitor/clipboard';
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonNote,
  IonPopover,
} from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { displayLongText } from '../../utils/long-text';

export const ListCopyTxHashItem = ({
  txHash,
  txHashUrl,
}: {
  txHash: string;
  txHashUrl?: string;
}) => {
  const { t } = useTranslation();
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const copyData = async (data: string, e: never) => {
    await Clipboard.write({
      string: data ?? '',
    });

    if (popover.current) {
      popover.current.event = e;
    }
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  return (
    <div
      className={
        'w-100 ion-display-flex ion-align-items-end ion-justify-content-between'
      }
    >
      <IonLabel>
        <span className={`ion-color-primary ion-text-size-xs ion-text-bold`}>
          {t('txHash')}
        </span>
      </IonLabel>
      <IonNote
        onClick={async (e: never) => copyData(txHashUrl ?? txHash, e)}
        className={`ion-text-size-xs ion-display-flex ion-align-items-center`}
        color="dark"
        slot={'end'}
      >
        <span>{displayLongText(txHash)}</span>
        <div
          style={{ height: '18px', width: '18px' }}
          className="ion-margin-left-xs"
        >
          <IonIcon
            slot="icon-only"
            className="copy-icon"
            src={`/shared-assets/images/copy-icon-dark.svg`}
          />
        </div>
        <IonPopover
          side="top"
          alignment="center"
          ref={popover}
          isOpen={popoverOpen}
          className={'copied-popover'}
          onDidDismiss={() => setPopoverOpen(false)}
        >
          <IonContent class="ion-padding">{t('Copied')}</IonContent>
        </IonPopover>
      </IonNote>
    </div>
  );
};
