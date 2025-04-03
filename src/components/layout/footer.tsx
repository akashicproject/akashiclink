import styled from '@emotion/styled';
import { IonFooter } from '@ionic/react';

const FooterText = styled.span({
  fontFamily: 'Nunito Sans',
  color: '#290056',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: '700',
  ['a']: {
    color: '#7444B6',
  },
});

export function Footer() {
  return (
    <>
      <IonFooter
        className="ion-no-border"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80px',
          background: '#F3F5F6',
        }}
      >
        <FooterText>
          Need help? Contact <a href={'url'}>HeliumWallet support</a>
        </FooterText>
      </IonFooter>
    </>
  );
}
