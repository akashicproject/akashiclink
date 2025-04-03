import './layout.css';

import styled from '@emotion/styled';
import { IonContent, IonFooter, IonPage } from '@ionic/react';
import type { ReactNode } from 'react';

import { LoggedToolbar } from '../logged/logged-toolbar';
import { LoggedHeader } from './logged-header';

const ChainDiv = styled.div({
  width: '100%',
  height: '40px',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 700,
  fontFamily: 'Nunito Sans',
  color: '#C297FF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 12px',
  borderBottom: '2px solid #C297FF',
  marginBottom: 32,
});

export const LoggedLayout: React.FC<{
  children: ReactNode;
  footer?: ReactNode;
}> = ({ children, footer }) => {
  return (
    <IonPage>
      <LoggedHeader />
      <IonContent>
        <ChainDiv>HeliumPay Chain</ChainDiv>
        <LoggedToolbar />
        {children}
      </IonContent>
      {footer && <IonFooter class={'ion-no-border'}>{footer}</IonFooter>}
    </IonPage>
  );
};
