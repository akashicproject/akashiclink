import './otk-box.css';

import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import { IonButton, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';

const OtkBoxText = styled.span({
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Nunito Sans',
  color: 'var(--ion-color-dark)',
});

/**
 * Simple box storing wrapped text with optional copy button on the side
 */
export function OtkBox({
  text,
  withCopy = true,
}: {
  text?: string;
  withCopy?: boolean;
}) {
  const handleCopy = async () => {
    await Clipboard.write({
      string: text || '',
    });
  };

  return (
    <IonItem lines="none">
      <IonLabel
        style={{
          border: '1px solid var(--ion-color-dark)',
          borderRadius: '4px',
          margin: '10px',
          marginRight: withCopy ? '10px' : '50px',
          padding: '10px',
          height: '80%',
        }}
      >
        <IonText class="ion-text-wrap" color="dark">
          <OtkBoxText>{text}</OtkBoxText>
        </IonText>
      </IonLabel>
      {withCopy && (
        <IonButton class="icon-button" onClick={handleCopy}>
          <IonIcon
            slot="icon-only"
            class="icon-button-icon"
            icon={copyOutline}
          />
        </IonButton>
      )}
    </IonItem>
  );
}
