import styled from '@emotion/styled';
import { IonButton, IonCol, IonIcon, IonImg, IonRow } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useState } from 'react';

const SliderWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0',
  gap: '24px',
  width: '265px',
  height: '56px',
});

const BalanceWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  height: '56px',
});

const BalanceTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  color: '#290056',
});

const BalanceText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#290056',
});

interface CurrencyObject {
  [key: number]: string;
}

export function SelectCoin() {
  const Currency: CurrencyObject = {
    1: 'Bitcoin',
    2: 'ETH',
    3: 'Tether',
  };
  const [selectedCoin, setSelectedCoin] = useState(1);
  const backCoin = () => {
    if (selectedCoin > 1) {
      setSelectedCoin(selectedCoin - 1);
    } else {
      setSelectedCoin(1);
    }
  };

  const forwardCoin = () => {
    if (selectedCoin < 3) {
      setSelectedCoin(selectedCoin + 1);
    } else {
      setSelectedCoin(3);
    }
  };
  return (
    <>
      <IonRow style={{ marginTop: '15px' }}>
        <IonCol class="ion-center">
          <SliderWrapper>
            <IonButton class={'arrow-btn'} onClick={backCoin}>
              <IonIcon
                class={'icon-arrow'}
                slot="icon-only"
                icon={chevronBackOutline}
              ></IonIcon>
            </IonButton>
            <IonImg
              alt={''}
              src="/shared-assets/images/bitcoin.png"
              style={
                selectedCoin == 1
                  ? { width: '56px', height: '56px' }
                  : { width: '32px', height: '32px', opacity: 0.2 }
              }
            />
            <IonImg
              alt={''}
              src="/shared-assets/images/eth.png"
              style={
                selectedCoin == 2
                  ? { width: '56px', height: '56px' }
                  : { width: '32px', height: '32px', opacity: 0.2 }
              }
            />
            <IonImg
              alt={''}
              src="/shared-assets/images/eth.png"
              style={
                selectedCoin == 3
                  ? { width: '56px', height: '56px' }
                  : { width: '32px', height: '32px', opacity: 0.2 }
              }
            />
            <IonButton class={'arrow-btn'} onClick={forwardCoin}>
              <IonIcon
                slot="icon-only"
                class={'icon-arrow'}
                icon={chevronForwardOutline}
              ></IonIcon>
            </IonButton>
          </SliderWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <BalanceWrapper>
            <BalanceTitle>0 {Currency[selectedCoin]}</BalanceTitle>
            <BalanceText>$0.00 USD</BalanceText>
          </BalanceWrapper>
        </IonCol>
      </IonRow>
    </>
  );
}
