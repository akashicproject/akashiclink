import './send.css';

import styled from '@emotion/styled';
import type {
  ITransactionSettledResponse,
  ITransactionVerifyResponse as VerifiedTransaction,
} from '@helium-pay/backend';
import { userConst } from '@helium-pay/backend';
import { IonCol, IonIcon, IonRow, IonSpinner } from '@ionic/react';
import axios from 'axios';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { BackButton } from '../../components/back-button';
import { PurpleButton } from '../../components/buttons';
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
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

const TextContent = styled.div({
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
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

interface Props {
  transaction: VerifiedTransaction[] | undefined;
  coinSymbol: string;
  gasFree: boolean;
  isResult: () => void;
  getErrorMsg: (msg: string) => void;
}

export function SendConfirm(props: Props) {
  const { t } = useTranslation();
  const { owner } = useOwner();
  const [password, setPassword] = useState<string>('');
  const [alert, setAlert] = useState(formAlertResetState);
  const [loading, setLoading] = useState(false);

  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const totalAmount = props.transaction
    ? props.transaction
        .reduce((sum, { amount }) => sum + BigInt(amount), BigInt(0))
        .toString()
    : '0';

  async function signTransaction() {
    if (props.transaction) {
      try {
        setLoading(true);
        await OwnersAPI.login({
          username: owner.username,
          password,
        });
        let response: ITransactionSettledResponse[];
        if (!props.gasFree) {
          response = await OwnersAPI.sendL1Transaction(props.transaction);
        } else {
          response = [await OwnersAPI.sendL2Transaction(props.transaction)];
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
          props.getErrorMsg(unpackRequestErrorMessage(error));
        } else {
          props.isResult();
          props.getErrorMsg(t('GenericFailureMsg'));
        }
      } finally {
        setLoading(false);
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
                {displayLongText(
                  props.transaction ? props.transaction[0].fromAddress : ''
                )}
              </TextContent>
              <IonIcon icon={arrowForwardCircleOutline} />
              <TextContent>
                {displayLongText(
                  props.transaction ? props.transaction[0].toAddress : ''
                )}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Amount')}</TextTitle>
              <TextTitle>
                {totalAmount} {props.coinSymbol}
              </TextTitle>
            </TextWrapper>
            <Divider />
            <TextWrapper>
              <TextTitle>{t('SendTo')}</TextTitle>
              <TextContent>
                {displayLongText(
                  props.transaction ? props.transaction[0].toAddress : ''
                )}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('EsTGasFee')}</TextTitle>
              <TextContent>
                {displayLongText(
                  props.transaction ? props.transaction[0].feesEstimate : ''
                )}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Total')}</TextTitle>
              <TextContent>{totalAmount}</TextContent>
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
        style={{
          marginTop: '24px',
          padding: '0px 50px',
        }}
      >
        <IonCol>
          <PurpleButton
            expand="block"
            onClick={signTransaction}
            disabled={loading}
          >
            {t('Confirm')}
            {loading ? (
              <IonSpinner style={{ marginLeft: '10px' }}></IonSpinner>
            ) : null}
          </PurpleButton>
        </IonCol>
        <IonCol>
          <BackButton />
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
