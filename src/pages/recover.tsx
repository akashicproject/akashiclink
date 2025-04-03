import styled from '@emotion/styled';
import { userConst } from '@helium-pay/backend';
import {
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActivationTimer } from '../components/activation/activation-timer';
import { PurpleButton, WhiteButton } from '../components/buttons';
import { LoggedLayout } from '../components/layout/logged-layout';
import { MainGrid } from '../components/layout/main-grid';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../components/styled-input';
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
  const { t } = useTranslation();
  const [view, setView] = useState(ResetEmailState.SetEmail);

  const [, setEmail] = useState<string>();
  const validateEmail = (value: string) => !!value.match(userConst.emailRegex);
  const [timerReset, setTimerReset] = useState(0);

  return (
    <LoggedLayout>
      <MainGrid>
        {view === ResetEmailState.SetEmail && (
          <>
            <IonRow>
              <IonCol class="ion-center">
                <IonText>
                  <h2>{t('PleaseEnterYourEmail')}</h2>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <StyledInput
                  label="Email"
                  type="email"
                  placeholder={t('EnterYourEmail')}
                  onIonInput={({ target: { value } }) => {
                    setEmail(value as string);
                  }}
                  errorPrompt={StyledInputErrorPrompt.Email}
                  validate={validateEmail}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <PurpleButton
                  expand="block"
                  onClick={() => {
                    setTimerReset(timerReset + 1);
                    setView(ResetEmailState.SetCode);
                  }}
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
                <ActivationTimer resetTrigger={timerReset} />
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
