import './otk-box.scss';

import { Clipboard } from '@capacitor/clipboard';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
} from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SquareWhiteButton } from '../buttons';

/**
 * Simple box storing wrapped text with optional copy button on the side
 */
export function OtkBox({
  label,
  text,
  withCopy = true,
  padding = true,
}: {
  label: string;
  text?: string;
  withCopy?: boolean;
  padding?: boolean;
}) {
  const { t } = useTranslation();

  const handleCopy = async (e: never) => {
    await Clipboard.write({
      string: text || '',
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
      <IonLabel class="otk-box-label">{label}</IonLabel>
      <IonItem
        class="ion-no-padding otk-box"
        lines="none"
        style={{
          paddingBottom: padding ? '20px' : '0px',
        }}
      >
        <h4
          style={{
            width: withCopy ? '70%' : '100%',
            marginRight: withCopy ? '5px' : 0,
          }}
        >
          {text}
        </h4>
        {withCopy && (
          <SquareWhiteButton
            class="icon-button"
            slot="end"
            onClick={handleCopy}
            style={{
              height: '100%',
              '--background': 'red',
            }}
            forceStyle={{ height: '100%' }}
          >
            <IonIcon
              slot="icon-only"
              class="icon-button-icon"
              icon={copyOutline}
            />
            <IonPopover
              side="top"
              alignment="center"
              ref={popover}
              isOpen={popoverOpen}
              class={'copied-popover'}
              onDidDismiss={() => setPopoverOpen(false)}
            >
              <IonContent class="ion-padding">{t('Copied')}</IonContent>
            </IonPopover>
          </SquareWhiteButton>
        )}
      </IonItem>
    </>
  );
}
