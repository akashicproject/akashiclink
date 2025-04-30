import { Clipboard } from '@capacitor/clipboard';
import { IonContent, IonPopover, IonText } from '@ionic/react';
import { type MouseEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CopyIcon } from './icons/copy-icon';

export function CopyButton({
  side = 'top',
  value,
  size = 18,
  className,
}: {
  side?: 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end';
  value: string;
  size?: number;
  className?: string;
}) {
  const { t } = useTranslation();

  const copyPopoverRef = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const copyValue = async (e: MouseEvent<Element>) => {
    e.stopPropagation();

    await Clipboard.write({
      string: value ?? '',
    });

    if (copyPopoverRef.current) {
      copyPopoverRef.current.event = e;
    }
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  return (
    <>
      <CopyIcon
        isGrey
        size={size}
        onClick={copyValue}
        slot="icon-only"
        className={className}
      />
      <IonPopover
        side={side}
        alignment="center"
        ref={copyPopoverRef}
        isOpen={popoverOpen}
        className={'copied-popover'}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <IonContent>
          <IonText>{t('Copied')}</IonText>
        </IonContent>
      </IonPopover>
    </>
  );
}
