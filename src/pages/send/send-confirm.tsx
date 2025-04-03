import './send.scss';

import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import type {
  IL1ClientSideOtkTransactionBase,
  ITransactionSettledResponse,
} from '@helium-pay/backend';
import { userConst } from '@helium-pay/backend';
import { IonCol, IonIcon, IonRow } from '@ionic/react';
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
} from '../../components/common/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/common/buttons';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../routing/history';
import { historyGoBackOrReplace } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { OwnersAPI } from '../../utils/api';
import { useDisableDeviceBackButton } from '../../utils/hooks/useDisableDeviceBackButton';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/hooks/useIosScrollPasswordKeyboardIntoView';
import { displayLongText } from '../../utils/long-text';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { SendMain } from './send-main';
import { TextContent, TextTitle, TextWrapper } from './send-result';

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0',
  gap: '8px',
  width: '100%',
});

const Divider = styled.div({
  borderTop: '1px solid #D9D9D9',
  boxSizing: 'border-box',
  height: '2px',
  width: '100%',
});

export function SendConfirm() {
  useIosScrollPasswordKeyboardIntoView();
  useDisableDeviceBackButton();

  const { t } = useTranslation();
  const [alert, setAlert] = useState(formAlertResetState);
  const [loading, setLoading] = useState(false);
  const history = useHistory<LocationState>();
  const state = history.location.state?.sendConfirm;

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
    history.replace({
      pathname: akashicPayPath(urls.sendResult),
      state: {
        sendResult: {
          fromAddress: state?.fromAddress ?? '',
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
        let response: ITransactionSettledResponse[];
        if (!state?.gasFree) {
          response = await OwnersAPI.sendL1TransactionUsingClientSideOtk(
            state?.transaction as IL1ClientSideOtkTransactionBase[]
          );
        } else {
          response = [
            await OwnersAPI.sendL2TransactionUsingClientSideOtk({
              ...state?.transaction[0],
              forceL1: undefined,
              signedTx: state.transaction[0].signedTx ?? '',
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
          error?.response?.data?.message === userConst.invalidPassErrorMsg
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
      <IonRow>
        <IonCol class="ion-center">
          <ContentWrapper>
            <TextWrapper>
              <TextTitle>
                <span className={'ion-text-size-xs ion-text-bold'}>
                  {t('From')}
                </span>
                {displayLongText(
                  state?.transaction
                    ? (state?.transaction[0] as IL1ClientSideOtkTransactionBase)
                        ?.fromAddress ?? state.fromAddress
                    : ''
                )}
              </TextTitle>
              <IonIcon icon={arrowForwardCircleOutline} />
              <TextTitle className={'ion-align-items-end'}>
                <span className={'ion-text-size-xs ion-text-bold'}>
                  {t('To')}
                </span>
                {displayLongText(
                  state?.transaction ? state?.transaction[0].toAddress : ''
                )}
              </TextTitle>
            </TextWrapper>
          </ContentWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size={'12'}>
          <Divider />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size={'12'}>
          <ContentWrapper>
            <TextWrapper>
              <TextTitle>{t('Amount')}</TextTitle>
              <TextContent>
                {Big(totalAmount).toFixed(2)} {state?.currencyDisplayName}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('SendTo')}</TextTitle>
              <TextContent>
                {displayLongText(state?.transaction?.[0]?.toAddress ?? '-')}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('EsTGasFee')}</TextTitle>
              <TextContent>
                {state?.transaction?.[0]?.feesEstimate
                  ? Big(state?.transaction?.[0]?.feesEstimate).toFixed(2)
                  : '-'}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Fee')}</TextTitle>
              <TextContent>
                {state?.transaction?.[0]?.internalFee?.withdraw
                  ? Big(state?.transaction?.[0]?.internalFee?.withdraw).toFixed(
                      2
                    )
                  : '-'}
              </TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Total')}</TextTitle>
              <TextContent>{Big(totalAmountWithFees).toFixed(2)}</TextContent>
            </TextWrapper>
          </ContentWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size={'12'}>
          <Divider />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size={'6'}>
          <PurpleButton
            expand="block"
            onClick={signTransaction}
            disabled={loading}
            isLoading={loading}
          >
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
        <IonCol size={'6'}>
          <WhiteButton
            expand="block"
            disabled={loading}
            onClick={() => {
              historyGoBackOrReplace();
            }}
          >
            {t('GoBack')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
