import './send.css';

import styled from '@emotion/styled';
import {
  IonCol,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/react';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { DividerDivWithoutMargin } from '../../components/layout/divider';
import { SendMain } from './send-main';

const SendWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '40px',
  height: '240px',
  width: '270px',
});

const CurrencyWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  width: '118px',
  height: '76px',
});

const BalanceText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  color: '#290056',
});

const InputWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: '24px',
  width: '270px',
});

const ChipWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: 0,
  gap: '16px',
  width: '270px',
});

const ChipText = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 16px',
  width: '214px',
  height: '40px',
  border: '1px solid #958E99',
  borderRadius: '8px',
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '10px',
});

const ResultChip = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '16px',
  width: '270px',
  height: '28px',
});

const FeeLeftDiv = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 16px',
  gap: '8px',
  width: '127px',
  height: '28px',
  borderRadius: '8px',
  background: '#41CC9A',
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '10px',
  color: '#FFFFFF',
});

const FeeRightDiv = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 16px',
  gap: '8px',
  width: '127px',
  height: '28px',
  borderRadius: '8px',
  border: '1px solid #7B757F',
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '10px',
  color: '#2B0053',
});

export function SendTo() {
  return (
    <SendMain>
      <IonRow>
        <IonCol class="ion-center">
          <CurrencyWrapper>
            <IonImg
              alt={''}
              src="/shared-assets/images/eth.png"
              style={{ width: '40px', height: '40px' }}
            />
            <BalanceText>0.000 ETH</BalanceText>
          </CurrencyWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <SendWrapper>
            <InputWrapper>
              <IonItem class="input-item">
                <IonLabel class="input-label">Send To</IonLabel>
                <IonInput
                  class="input-input"
                  placeholder="Enter the address"
                ></IonInput>
              </IonItem>
            </InputWrapper>
            <ChipWrapper>
              <ChipText>Iloveu.he = AAx222222222222</ChipText>
              <IonImg
                alt={''}
                src="/shared-assets/images/right.png"
                style={{ width: '40px', height: '40px' }}
              />
            </ChipWrapper>
            <DividerDivWithoutMargin />
            <ResultChip>
              <FeeLeftDiv>Gas Free</FeeLeftDiv>
              <FeeRightDiv>Fee: 0.001ETH</FeeRightDiv>
            </ResultChip>
          </SendWrapper>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-between" style={{ marginTop: '24px' }}>
        <IonCol>
          <PurpleButton expand="block">Send</PurpleButton>
        </IonCol>
        <IonCol>
          <WhiteButton expand="block">Cancel</WhiteButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
