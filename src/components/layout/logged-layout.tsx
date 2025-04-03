import './layout.css';

import styled from '@emotion/styled';
import {
  IonContent,
  IonFooter,
  IonPage,
  IonRouterLink,
  isPlatform,
} from '@ionic/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { LoggedToolbar } from '../logged/logged-toolbar';
import { LoggedHeader } from './logged-header';

// TODO: move the exported component to a separate file since it is used in other places
export const ChainDiv = styled(IonRouterLink)({
  width: '100%',
  height: '40px',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 12px',
  borderBottom: '2px solid #C297FF',
});

export const LoggedLayout: React.FC<{
  children: ReactNode;
  footer?: ReactNode;
}> = ({ children, footer }) => {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const ChainDivMarginBottom = isMobile ? '32px' : '0px';
  return (
    <IonPage>
      <LoggedHeader loggedIn={true} />
      <IonContent>
        <ChainDiv
          style={{ marginBottom: ChainDivMarginBottom }}
          routerLink={akashicPayPath(urls.loggedFunction)}
        >
          {t('AkashicChain')}
        </ChainDiv>
        <LoggedToolbar />
        {children}
      </IonContent>
      {footer && <IonFooter class={'ion-no-border'}>{footer}</IonFooter>}
    </IonPage>
  );
};
