import './copy.css';

import styled from '@emotion/styled';
import { IonButton, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';

const CopyText = styled.span({
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Nunito Sans',
  color: 'var(--ion-color-dark)',
});

/**
 * Simple box storing wrapped text with copy button on the side
 */
export function Copy({ text }: { text?: string }) {
  return (
    <IonItem lines="none">
      <IonLabel
        style={{
          border: '1px solid var(--ion-color-dark)',
          borderRadius: '4px',
          margin: '10px',
          padding: '10px',
          height: '80%',
        }}
      >
        <IonText class="ion-text-wrap" color="dark">
          <CopyText>{text}</CopyText>
        </IonText>
      </IonLabel>
      <IonButton
        class="icon-button"
        onClick={() => navigator.clipboard.writeText(text || '')}
      >
        <IonIcon slot="icon-only" class="icon-button-icon" icon={copyOutline} />
      </IonButton>
    </IonItem>
  );
}
