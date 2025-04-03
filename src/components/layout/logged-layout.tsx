import styled from '@emotion/styled';
import {
  IonContent,
  IonFooter,
  IonPage,
  IonRouterLink,
  isPlatform,
} from '@ionic/react';
import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useOwner } from '../../utils/hooks/useOwner';
import { lastPageStorage } from '../../utils/last-page-storage';
import { Spinner } from '../loader/spinner';
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

export function LoggedLayout({
  children,
  footer,
  isRefresh = false,
  isToolBar = true,
}: {
  children: ReactNode;
  footer?: ReactNode;
  isRefresh?: boolean;
  isToolBar?: boolean;
}) {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const ChainDivMarginBottom = isMobile ? '5px' : '0px';

  const { isLoading, authenticated } = useOwner(true);

  /** If user auth has expired, redirect to login page */
  useEffect(() => {
    if (!isLoading && !authenticated) {
      lastPageStorage.clear();
    }
  }, [isLoading, authenticated]);

  if (isLoading) return <Spinner />;

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
        {isToolBar && <LoggedToolbar isRefresh={isRefresh} />}
        {children}
      </IonContent>
      {footer && <IonFooter class={'ion-no-border'}>{footer}</IonFooter>}
    </IonPage>
  );
}
