import styled from '@emotion/styled';
import { IonCol, IonImg, IonRow } from '@ionic/react';

import { PurpleButton } from '../../components/buttons';
import { DividerDivWithoutMargin } from '../../components/layout/divider';
import { SendMain } from './send-main';

const HeaderWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '16px',
  height: '80px',
  width: '150px',
  marginTop: '20px',
});

const HeaderTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#290056',
});

const ResultContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '16px',
  width: '270px',
});

const TextWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px',
  width: '270px',
  height: '24px',
});

const TextTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  color: '#290056',
});

const TextContent = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#290056',
});

export function SendResult() {
  return (
    <SendMain>
      <IonRow>
        <IonCol class="ion-center">
          <HeaderWrapper>
            <IonImg
              alt={''}
              src="/shared-assets/images/right.png"
              style={{ width: '40px', height: '40px' }}
            />
            <HeaderTitle>Transaction Successful</HeaderTitle>
            <DividerDivWithoutMargin />
          </HeaderWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <ResultContent>
            <TextWrapper>
              <TextTitle>Send</TextTitle>
              <TextContent>AAx111111</TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>Receiver</TextTitle>
              <TextContent>AAx111111</TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>Amount</TextTitle>
              <TextContent>USDT xx</TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>Gas</TextTitle>
              <TextContent>Gas Fee/xx Gwei</TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>Fee</TextTitle>
              <TextContent>...</TextContent>
            </TextWrapper>
          </ResultContent>
        </IonCol>
      </IonRow>
      <IonRow style={{ marginTop: '50px' }}>
        <IonCol>
          <PurpleButton expand="block">Confirm</PurpleButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
