import './otk-box.scss';

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
  onClick,
  padding = true,
}: {
  label: string;
  text?: string;
  withCopy?: boolean;
  onClick?: () => void;
  padding?: boolean;
}) {
  const handleCopy = async () => {
    await Clipboard.write({
      string: text || '',
    });
    onClick && onClick();
  };

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
