import './send.css';

import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import type { ITransactionSettledResponse } from '@helium-pay/backend';
import { userConst } from '@helium-pay/backend';
import { IonCol, IonIcon, IonRow, IonSpinner } from '@ionic/react';
import axios from 'axios';
import Big from 'big.js';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { akashicPayPath } from '../../routing/navigation-tree';
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

export function SendConfirm() {
  const { t } = useTranslation();
  const { owner } = useOwner();
  const [password, setPassword] = useState<string>('');
  const [alert, setAlert] = useState(formAlertResetState);
  const [loading, setLoading] = useState(false);
  const history = useHistory<LocationState>();
  const state = history.location.state?.sendConfirm;

  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);

  let totalAmount = Big(0);

  const totalAmountWithFees = state?.transaction
    ? state?.transaction
        .reduce((sum, { amount, feesEstimate, internalFee }) => {
          totalAmount = totalAmount.add(amount);
          return Big(amount)
            .add(feesEstimate ?? '0')
            .add(internalFee?.withdraw ?? '0')
            .add(sum);
        }, Big(0))
        .toString()
    : '0';

  const goToResult = (signError: string) => {
    setPassword('');
    history.push({
      pathname: akashicPayPath(urls.sendResult),
      state: {
        sendResult: {
          errorMsg: signError,
          transaction: state?.transaction,
          currencyDisplayName: state?.currencyDisplayName,
        },
      },
    });
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async function signTransaction() {
    if (state?.transaction) {
      try {
        setLoading(true);
        await OwnersAPI.confirmPassword({
          username: owner.username,
          password,
        });
        let response: ITransactionSettledResponse[];
        if (!state?.gasFree) {
          response = await OwnersAPI.sendL1Transaction(state?.transaction);
        } else {
          response = [
            await OwnersAPI.sendL2Transaction({
              ...state?.transaction[0],
              forceL1: undefined,
            }),
          ];
        }
        if (!response[0].isSuccess) {
          setAlert(
            errorAlertShell(
              t(unpackRequestErrorMessage(response[0].reason) || '')
            )
          );
          goToResult(t(unpackRequestErrorMessage(response[0].reason)));
        } else {
          goToResult(errorMsgs.NoError);
        }
      } catch (error) {
        datadogRum.addError(error);
        // TODO: For this error msg translation: extract it into its own function you are are re-using this code
        if (
          axios.isAxiosError(error) &&
          error?.response?.data?.message === userConst.invalidUserErrorMsg
        ) {
          setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
        } else if (axios.isAxiosError(error)) {
          goToResult(t(unpackRequestErrorMessage(error)));
        } else {
          goToResult(t('GenericFailureMsg'));
        }
      } finally {
        setLoading(false);
      }
    }
  }
  return (
    <SendMain>
      <CustomAlert state={alert} />
      <IonRow style={{ marginTop: '40px' }}>
        <IonCol class="ion-center">
          <ContentWrapper>
            <TextWrapper>
              <TextContent>
                {displayLongText(
                  state?.transaction ? state?.transaction[0].fromAddress : ''
                )}
              </TextContent>
              <IonIcon icon={arrowForwardCircleOutline} />
              <TextContent>
                {displayLongText(
                  state?.transaction ? state?.transaction[0].toAddress : ''
                )}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Amount')}</TextTitle>
              <TextTitle>
                {totalAmount.toString()} {state?.currencyDisplayName}
              </TextTitle>
            </TextWrapper>
            <Divider />
            <TextWrapper>
              <TextTitle>{t('SendTo')}</TextTitle>
              <TextContent>
                {displayLongText(
                  state?.transaction ? state?.transaction[0].toAddress : ''
                )}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('EsTGasFee')}</TextTitle>
              <TextContent>
                {displayLongText(
                  state?.transaction ? state?.transaction[0].feesEstimate : ''
                )}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Fee')}</TextTitle>
              <TextContent>
                {state?.transaction?.[0]?.internalFee?.withdraw ?? '-'}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Total')}</TextTitle>
              <TextContent>{totalAmountWithFees.toString()}</TextContent>
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
              submitOnEnter={signTransaction}
              value={password}
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
        <IonCol
          style={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <WhiteButton
            onClick={() => {
              history.push(akashicPayPath(urls.loggedFunction));
              setPassword('');
            }}
          >
            {t('GoBack')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
