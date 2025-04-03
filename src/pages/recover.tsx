import styled from '@emotion/styled';
import {
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
} from '@ionic/react';
import { useState } from 'react';

import { PurpleButton, WhiteButton } from '../components/buttons';
import { CountdownDiv } from '../components/layout/countdown';
import { LoggedLayout } from '../components/layout/loggedLayout';
import { MainGrid } from '../components/layout/main-grid';
import { ResetPassword } from './Recovery/reset-password';

const Message = styled.span({
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  fontFamily: 'Nunito Sans',
  textAlign: 'center',
  color: 'var(--ion-color)',
});

export enum ResetEmailState {
  SetEmail,
  SetCode,
  NewLockPassword,
}

export function Recover() {
  const [view, setView] = useState(ResetEmailState.SetEmail);

  return (
    <LoggedLayout>
      <MainGrid>
        {view === ResetEmailState.SetEmail && (
          <>
            <IonRow>
              <IonCol class="ion-center">
                <IonText>
                  <h2>Please enter your email</h2>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem fill="outline">
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput placeholder="Please enter new backup email" />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <PurpleButton
                  expand="block"
                  onClick={() => setView(ResetEmailState.SetCode)}
                >
                  Send
                </PurpleButton>
              </IonCol>
            </IonRow>
          </>
        )}
        {view === ResetEmailState.SetCode && (
          <>
            <IonRow>
              <IonCol class="ion-center">
                <Message>Verification Code Sent</Message>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol class="ion-center">
                <CountdownDiv>60</CountdownDiv>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem fill="outline">
                  <IonLabel position="floating">Code</IonLabel>
                  <IonInput placeholder="Please enter code sent" />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <PurpleButton
                  onClick={() => setView(ResetEmailState.NewLockPassword)}
                >
                  Confirm
                </PurpleButton>
              </IonCol>
              <IonCol>
                <WhiteButton>Skip Backup</WhiteButton>
              </IonCol>
            </IonRow>
          </>
        )}
        {view === ResetEmailState.NewLockPassword && <ResetPassword />}
      </MainGrid>
    </LoggedLayout>
  );
}
