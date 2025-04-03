import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';

import { PurpleButton, WhiteButton } from '../buttons';
import { MainGrid } from '../layout/main-grid';
import { StyledInput } from '../styled-input';

const Message = styled.span({
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  fontFamily: 'Nunito Sans',
  textAlign: 'center',
  color: 'var(--ion-color)',
});

/**
 * Component instructing user to supply a 2fa code, which is injected into the callback function
 * and sent as a request when CONFIRM is clicked
 */
export function SubmitActivationCode({
  onClose,
  submitWithActivationCode,
}: {
  onClose: () => void;
  submitWithActivationCode: (activationCode: string) => Promise<void>;
}) {
  const [activationCode, setActivationCode] = useState<string>();

  return (
    <MainGrid>
      <IonRow>
        <IonCol class="ion-center">
          <Message>Please complete 2FA</Message>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <StyledInput
            label="Activation Code"
            placeholder="Please enter code sent to your email"
            onIonInput={({ target: { value } }) =>
              setActivationCode(value as string)
            }
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <WhiteButton
            onClick={() => {
              setActivationCode(undefined);
              onClose();
            }}
          >
            Cancel
          </WhiteButton>
        </IonCol>
        <IonCol class="ion-center">
          <PurpleButton
            disabled={!activationCode}
            onClick={async () => {
              activationCode && submitWithActivationCode(activationCode);
            }}
          >
            Confirm
          </PurpleButton>
        </IonCol>
      </IonRow>
    </MainGrid>
  );
}
