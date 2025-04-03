import styled from '@emotion/styled';
import type { IL1ClientSideOtkTransactionBase } from '@helium-pay/backend';
import { IonCol, IonIcon, IonImg, IonRow } from '@ionic/react';
import Big from 'big.js';
import { arrowForwardCircleOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { PurpleButton } from '../../components/common/buttons';
import { DividerDivWithoutMargin } from '../../components/common/divider';
import { errorMsgs } from '../../constants/error-messages';
import type { LocationState } from '../../routing/history';
import { historyResetStackAndRedirect } from '../../routing/history';
import { useBalancesMe } from '../../utils/hooks/useBalancesMe';
import { useDisableDeviceBackButton } from '../../utils/hooks/useDisableDeviceBackButton';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';
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
});

export const HeaderTitle = styled.div({
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
  textAlign: 'center',
});

export const ResultContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '8px',
  width: '100%',
});

export const TextWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px',
  minHeight: '24px',
  width: '100%',
});

export const TextTitle = styled.div({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
  display: 'flex',
  flexDirection: 'column',
});

export const TextContent = styled.div({
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

export function SendResult() {
  useDisableDeviceBackButton();

  const { t } = useTranslation();
  const { mutateBalancesMe } = useBalancesMe();
  const { mutateTransfersMe } = useTransfersMe();
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
            <HeaderTitle>
              {wrongResult
                ? state?.errorMsg
                : t('TransactionSuccessful') + Layer}
            </HeaderTitle>
          </HeaderWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <DividerDivWithoutMargin />
        </IonCol>
      </IonRow>
      {wrongResult ? null : (
        <IonRow>
          <IonCol size={'12'}>
            <ResultContent>
              <TextWrapper>
                <TextTitle>
                  <span className={'ion-text-size-xs ion-text-bold'}>
                    {t('From')}
                  </span>
                  {displayLongText(
                    state?.transaction
                      ? (
                          state
                            ?.transaction[0] as IL1ClientSideOtkTransactionBase
                        )?.fromAddress ?? state.fromAddress
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
              <TextWrapper>
                <TextTitle>{t('Coin')}</TextTitle>
                <TextContent>{state?.currencyDisplayName}</TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('Amount')}</TextTitle>
                <TextContent>{Big(totalAmount).toFixed(2)}</TextContent>
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
                <TextTitle>{t('InternalFee')}</TextTitle>
                <TextContent>
                  {state?.transaction?.[0]?.internalFee?.withdraw
                    ? Big(
                        state?.transaction?.[0]?.internalFee?.withdraw
                      ).toFixed(2)
                    : '-'}
                </TextContent>
              </TextWrapper>
            </ResultContent>
          </IonCol>
        </IonRow>
      )}
      <IonRow className={'ion-center'}>
        <IonCol size={'6'}>
          <PurpleButton
            expand="block"
            onClick={async () => {
              await mutateBalancesMe();
              await mutateTransfersMe();
              historyResetStackAndRedirect();
            }}
          >
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
