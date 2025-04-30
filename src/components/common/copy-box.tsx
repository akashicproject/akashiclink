import { Clipboard } from '@capacitor/clipboard';
import { IonContent, IonLabel, IonPopover } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BorderedBox } from './box/border-box';
import { CopyIcon } from './icons/copy-icon';

export function CopyBox({
  compact = false,
  label,
  text,
  copyText,
}: {
  compact?: boolean;
  label?: string;
  text?: string;
  copyText?: string;
}) {
  const { t } = useTranslation();
  const handleCopy = async (e: never) => {
    await Clipboard.write({
      string: copyText ?? text ?? '',
    });

    if (popover.current) popover.current.event = e;
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      {label && (
        <IonLabel className="ion-text-size-xs ion-margin-bottom-xxs">
          {label}
        </IonLabel>
      )}
      <BorderedBox compact={compact} lines="full" onClick={handleCopy}>
        <p
          style={{ width: 'calc(100% - 20px)' }}
          className="ion-text-size-sm ion-text-bold"
        >
          {text}
        </p>
        <CopyIcon size={16} className={'ion-margin-left-auto'} />
      </BorderedBox>
      <IonPopover
        side="top"
        alignment="center"
        ref={popover}
        isOpen={popoverOpen}
        className={'copied-popover'}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <IonContent>{t('Copied')}</IonContent>
      </IonPopover>
    </>
  );
}
