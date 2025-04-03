import './otk-box.css';
import '../styled-input.css';

import { Clipboard } from '@capacitor/clipboard';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';

/**
 * Simple box storing wrapped text with optional copy button on the side
 */
export function OtkBox({
  label,
  text,
  withCopy = true,
}: {
  label: string;
  text?: string;
  withCopy?: boolean;
}) {
  const handleCopy = async () => {
    await Clipboard.write({
      string: text || '',
    });
  };

  return (
    <>
      <IonLabel class="styled-label">{label}</IonLabel>
      <IonItem
        class="ion-no-padding"
        lines="none"
        style={{
          '--padding-end': '0px',
          '--inner-padding-end': '0px',
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '20px',
        }}
      >
        <h4
          style={{
            border: '1px solid var(--ion-color-dark)',
            borderRadius: '4px',
            width: withCopy ? '80%' : '100%',
            padding: '10px',
            margin: 0,
            marginRight: withCopy ? '5px' : 0,
            wordWrap: 'break-word',
            fontWeight: 600,
            fontSize: '13px',
            flexGrow: 1,
            minHeight: '48px',
          }}
        >
          {text}
        </h4>
        {withCopy && (
          <IonButton
            class="icon-button"
            slot="end"
            onClick={handleCopy}
            style={{
              height: '100%',
            }}
          >
            <IonIcon
              slot="icon-only"
              class="icon-button-icon"
              icon={copyOutline}
            />
          </IonButton>
        )}
      </IonItem>
    </>
  );
}
