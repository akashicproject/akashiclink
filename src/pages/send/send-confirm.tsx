import './send.css';

import styled from '@emotion/styled';
import type { ITransactionVerifyResponse as VerifiedTransaction } from '@helium-pay/backend';
import { userConst } from '@helium-pay/backend';
import { IonCol, IonIcon, IonRow } from '@ionic/react';
import axios from 'axios';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { OwnersAPI } from '../../utils/api';
import { useOwner } from '../../utils/hooks/useOwner';
import { displayLongText } from '../../utils/long-text';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { SendMain } from './send-main';

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  gap: '24px',
  width: '270px',
});

const Divider = styled.div({
  borderTop: '1px solid #D9D9D9',
  boxSizing: 'border-box',
  height: '2px',
  width: '270px',
});

const TextWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px',
  width: '270px',
});

const TextTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

const TextContent = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

const InputPasswordWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  width: '270px',
  gap: '16px',
});

const InputPasswordText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

interface Props {
  transaction: VerifiedTransaction | undefined;
  coinSymbol: string;
  gasFree: boolean;
  isResult: () => void;
  getErrorMsg: (msg: string) => void;
  goBack: () => void;
}

export function SendConfirm(props: Props) {
  const { t } = useTranslation();
  const { owner } = useOwner();
  const [password, setPassword] = useState<string>('');
  const [alert, setAlert] = useState(formAlertResetState);

  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);

  async function signTransaction() {
    if (props.transaction) {
      try {
        await OwnersAPI.login({
          username: owner.username,
          password,
        });
        let response;
        if (!props.gasFree) {
          const signedTransaction = await OwnersAPI.signTransaction([
            props.transaction,
          ]);
          response = await OwnersAPI.sendL1Transaction(signedTransaction);
        } else {
          response = [await OwnersAPI.sendL2Transaction([props.transaction])];
        }
        if (!response[0].isSuccess) {
          setAlert(
            errorAlertShell(
              t(unpackRequestErrorMessage(response[0].reason) || '')
            )
          );
        }
        props.isResult();
      } catch (error) {
        // TODO: For this error msg translation: extract it into its own function you are are re-using this code
        if (
          axios.isAxiosError(error) &&
          error?.response?.data?.message === userConst.invalidUserErrorMsg
        ) {
          setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
        } else if (axios.isAxiosError(error)) {
          props.isResult();
          props.getErrorMsg(
            unpackRequestErrorMessage(error?.response?.data?.message)
          );
        } else {
          props.isResult();
          props.getErrorMsg(t('GenericFailureMsg'));
        }
      }
    }
  }
  return (
    <SendMain>
      <Alert state={alert} />
      <IonRow style={{ marginTop: '40px' }}>
        <IonCol class="ion-center">
          <ContentWrapper>
            <TextWrapper>
              <TextContent>
                {displayLongText(props.transaction?.fromAddress)}
              </TextContent>
              <IonIcon icon={arrowForwardCircleOutline} />
              <TextContent>
                {displayLongText(props.transaction?.toAddress)}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Amount')}</TextTitle>
              <TextTitle>
                {props.transaction?.amount} {props.coinSymbol}
              </TextTitle>
            </TextWrapper>
            <Divider />
            <TextWrapper>
              <TextTitle>{t('SendTo')}</TextTitle>
              <TextContent>
                {displayLongText(props.transaction?.toAddress)}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('EsTGasFee')}</TextTitle>
              <TextContent>{props.transaction?.feesEstimate}</TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Total')}</TextTitle>
              <TextContent>{props.transaction?.amount}</TextContent>
            </TextWrapper>
            <Divider />
          </ContentWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <InputPasswordWrapper>
            <InputPasswordText>{t('PleaseConfirm')}</InputPasswordText>
            <StyledInput
              style={{ width: '270px' }}
              placeholder={t('PleaseEnterYourPassword') as string}
              type={'password'}
              onIonInput={({ target: { value } }) =>
                setPassword(value as string)
              }
              validate={validatePassword}
              errorPrompt={StyledInputErrorPrompt.Password}
            ></StyledInput>
          </InputPasswordWrapper>
        </IonCol>
      </IonRow>
      <IonRow
        class="ion-justify-content-between"
        style={{ marginTop: '24px', padding: '0px 50px' }}
      >
        <IonCol>
          <PurpleButton expand="block" onClick={signTransaction}>
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
        <IonCol>
          <WhiteButton expand="block" onClick={props.goBack}>
            {t('GoBack')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
