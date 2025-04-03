import styled from '@emotion/styled';
import { IonCol, IonImg, IonRow } from '@ionic/react';
import Big from 'big.js';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSWRConfig } from 'swr';

import { PurpleButton } from '../../components/buttons';
import { DividerDivWithoutMargin } from '../../components/layout/divider';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { displayLongText } from '../../utils/long-text';
import { SendMain } from './send-main';

// TODO: move the exported components to separate files since they are used in other places
export const HeaderWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  gap: '16px',
  height: '80px',
  width: '150px',
  marginTop: '20px',
});

export const HeaderTitle = styled.div({
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
  textAlign: 'center',
});

export const ResultContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '16px',
  width: '270px',
});

export const TextWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px',
  width: '270px',
  height: '24px',
});

export const TextTitle = styled.div({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

export const TextContent = styled.div({
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

export function SendResult() {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const history = useHistory<LocationState>();
  const state = history.location.state?.sendResult;
  const wrongResult = state?.errorMsg !== errorMsgs.NoError;
  const Layer =
    state?.transaction && state?.transaction[0]?.forceL1
      ? ' - ' + t('Layer1')
      : '';

  const totalAmount = state?.transaction
    ? state?.transaction
        .reduce((sum, { amount }) => Big(amount).add(sum), Big(0))
        .toString()
    : '0';

  return (
    <SendMain>
      <IonRow>
        <IonCol class="ion-center">
          <HeaderWrapper>
            <IonImg
              alt={''}
              src={
                wrongResult
                  ? '/shared-assets/images/wrong.png'
                  : '/shared-assets/images/right.png'
              }
              style={{ width: '40px', height: '40px' }}
            />
            <HeaderTitle style={{ width: '213px' }}>
              {wrongResult
                ? state?.errorMsg
                : t('TransactionSuccessful') + Layer}
            </HeaderTitle>
            <DividerDivWithoutMargin />
          </HeaderWrapper>
        </IonCol>
      </IonRow>
      {wrongResult ? null : (
        <IonRow>
          <IonCol class="ion-center" style={{ marginTop: '20px' }}>
            <ResultContent>
              <TextWrapper>
                <TextTitle>{t('Send')}</TextTitle>
                <TextContent>
                  {displayLongText(
                    state?.transaction ? state?.transaction[0].fromAddress : ''
                  )}
                </TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('Receiver')}</TextTitle>
                <TextContent>
                  {displayLongText(
                    state?.transaction ? state?.transaction[0].toAddress : ''
                  )}
                </TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('Coin')}</TextTitle>
                <TextContent>{state?.currencyDisplayName}</TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('Amount')}</TextTitle>
                <TextContent>{totalAmount}</TextContent>
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
                <TextTitle>{t('InternalFee')}</TextTitle>
                <TextContent>
                  {state?.transaction?.[0]?.internalFee?.withdraw ?? '-'}
                </TextContent>
              </TextWrapper>
            </ResultContent>
          </IonCol>
        </IonRow>
      )}
      <IonRow style={{ marginTop: '50px', padding: '0px 50px' }}>
        <IonCol>
          <PurpleButton
            expand="block"
            onClick={async () => {
              await mutate('/owner/agg-balances');
              await mutate(
                (key) =>
                  typeof key === 'string' && key.startsWith('/key/transfers/me')
              );
              history.push(akashicPayPath(urls.loggedFunction));
            }}
          >
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
