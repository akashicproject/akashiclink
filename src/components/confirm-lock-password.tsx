import styled from '@emotion/styled';
import { userConst } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';

import { PurpleButton, WhiteButton } from './buttons';
import { MainGrid } from './layout/main-grid';
import { MainTitle } from './layout/main-title';
import { StyledInput } from './styled-input';

const Message = styled.span({
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  fontFamily: 'Nunito Sans',
  textAlign: 'center',
  color: 'var(--ion-color)',
});

/**
 * Initiates a confirmation procedure using supplied method
 *
 * @param setVal callback to initiate requres to backend with the signed password
 */
export function ConfirmLockPassword({
  setVal,
}: {
  setVal: (password: string) => void;
}) {
  const [password, setPassword] = useState<string>();

  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);

  return (
    <MainGrid>
      <IonRow>
        <IonCol class="ion-center">
          <MainTitle>KeyPair Backup</MainTitle>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <Message>Please enter your password</Message>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <StyledInput
            label={'Password'}
            type="password"
            placeholder={'Please confirm your password'}
            onIonInput={({ target: { value } }) => setPassword(value as string)}
            validate={validatePassword}
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <WhiteButton>Cancel</WhiteButton>
        </IonCol>
        <IonCol>
          <PurpleButton
            disabled={!password}
            onClick={() => password && setVal(password)}
          >
            Confirm
          </PurpleButton>
        </IonCol>
      </IonRow>
    </MainGrid>
  );
}
