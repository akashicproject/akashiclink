import './send.css';

import styled from '@emotion/styled';
import type { ITransactionVerifyResponse as VerifiedTransaction } from '@helium-pay/backend';
import { IonCol, IonInput, IonRow } from '@ionic/react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { DividerDivWithoutMargin } from '../../components/layout/divider';
import { OwnersAPI } from '../../utils/api';
import { handleErrorMessage } from '../../utils/getErrorMessageTKey';
import { useOwner } from '../../utils/hooks/useOwner';
import { displayLongText } from '../../utils/long-text';
import { SendMain } from './send-main';

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  gap: '24px',
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
  color: '#290056',
});

const TextContent = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  color: '#290056',
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
  color: '#290056',
});

interface Props {
  transaction: VerifiedTransaction | undefined;
  coinSymbol: string;
  isResult: () => void;
  getErrorMsg: (msg: string) => void;
  goBack: () => void;
}

export function SendConfirm(props: Props) {
  const { t } = useTranslation();
  const { owner } = useOwner();
  const [password, setPassword] = useState<string>('');
  const [passwordWrong, setPasswordWrong] = useState(false);

  async function signTransaction() {
    setPasswordWrong(false);
    if (props.transaction) {
      try {
        await OwnersAPI.login({
          username: owner.username,
          password,
        });
        const signedTransaction = await OwnersAPI.signTransaction([
          props.transaction,
        ]);
        const response = await OwnersAPI.sendTransaction(signedTransaction);
        if (!response[0].isSuccess) {
          handleErrorMessage(response[0].reason || '');
        }
        props.isResult();
      } catch (error) {
        // TODO: For this error msg translation: extract it into its own function you are are re-using this code
        if (
          axios.isAxiosError(error) &&
          error?.response?.data?.message === 'Invalid passphrase or password'
        ) {
          setPasswordWrong(true);
          setPassword('');
        } else if (axios.isAxiosError(error)) {
          props.isResult();
          props.getErrorMsg(handleErrorMessage(error?.response?.data?.message));
        } else {
          props.isResult();
          props.getErrorMsg(t('GenericFailureMsg'));
        }
      }
    }
  }
  return (
    <SendMain>
      <IonRow style={{ marginTop: '40px' }}>
        <IonCol class="ion-center">
          <ContentWrapper>
            <TextWrapper>
              <TextTitle>
                {props.transaction?.amount} {props.coinSymbol}
              </TextTitle>
            </TextWrapper>
            <DividerDivWithoutMargin />
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
            <DividerDivWithoutMargin />
          </ContentWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <InputPasswordWrapper>
            <InputPasswordText
              /* TODO: make it into a reusable component */
              style={passwordWrong ? { color: 'red' } : { color: '#290056' }}
            >
              {passwordWrong ? t('WrongPassword') : t('PleaseConfirm')}
            </InputPasswordText>
            <IonInput
              /** TODO: t('PleaseEnterYourPassword') is not correctly recognised as string - maybe be fixed in the translations refactor */
              placeholder={t('PleaseEnterYourPassword') as string}
              class="input-password"
              type={'password'}
              onIonInput={({ target: { value } }) =>
                setPassword(value as string)
              }
            ></IonInput>
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
