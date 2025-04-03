import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
} from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { themeType } from '../../theme/const';
import { useTheme } from '../providers/PreferenceProvider';

const BorderedBox = styled(IonItem)<{ compact: boolean }>(({ compact }) => ({
  '--min-height': 'auto',
  ['&::part(native)']: {
    color: 'var(--ion-color-primary)',
    '--border-color': '#7b757f',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: '0.75rem',
    '--inner-padding-end': '8px',
    marginInlineStart: 0,
    height: compact ? 32 : 'auto',
  },
  p: {
    textWrap: 'wrap',
    width: '100%',
  },
}));

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
  const [storedTheme] = useTheme();
  const handleCopy = async (e: never) => {
    await Clipboard.write({
      string: copyText || text || '',
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
      {label && <IonLabel class="ion-text-size-xs">{label}</IonLabel>}
      <BorderedBox compact={compact} lines="full" onClick={handleCopy}>
        <p>{text}</p>
        <IonIcon
          size={'small'}
          slot="end"
          className="icon-button-icon"
          src={`/shared-assets/images/${
            storedTheme === themeType.DARK
              ? 'copy-icon-white.svg'
              : 'copy-icon-dark.svg'
          }`}
        />
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
      </BorderedBox>
    </>
  );
}
