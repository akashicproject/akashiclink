import styled from '@emotion/styled';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/react';
import { copyOutline } from 'ionicons/icons';

import { LoggedMain } from './logged-main';

const WrapperDiv = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0',
  gap: '16px',
  width: '304px',
  height: '226px',
  marginTop: '20px',
});

const CoinWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0',
  gap: '8px',
  width: '81x',
  height: '40px',
});

const CoinText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#290056',
});

const AddressTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '10px',
  lineHeight: '16px',
  color: '#290056',
});

const AddressContent = styled.p({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  paddingLeft: '10px',
  color: '#4A454E',
  width: '280px',
  height: '36px',
  border: '1px solid #7B757F',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export function LoggedAddress() {
  return (
    <LoggedMain>
      <>
        <IonRow style={{ marginTop: '15px' }}>
          <IonCol class="ion-center">
            <WrapperDiv>
              <CoinWrapper>
                <IonImg
                  alt={''}
                  src="/shared-assets/images/eth.png"
                  style={{ width: '40px', height: '40px' }}
                />
                <CoinText>ETH</CoinText>
              </CoinWrapper>
              <IonImg
                alt={''}
                src="/shared-assets/images/qrcode.png"
                style={{ width: '90px', height: '90px' }}
              />
              <IonItem class="address-item">
                <IonLabel>
                  <AddressTitle>Public Address</AddressTitle>
                  <AddressContent>
                    XXXXXXXXXYYYYYYYYYY
                    <IonButton class="address-copy-btn">
                      <IonIcon slot="start" icon={copyOutline}></IonIcon>
                    </IonButton>
                  </AddressContent>
                </IonLabel>
              </IonItem>
            </WrapperDiv>
          </IonCol>
        </IonRow>
      </>
    </LoggedMain>
  );
}
