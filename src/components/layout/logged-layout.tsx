import { Preferences } from '@capacitor/preferences';
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
  padding: '8px 12px',
  borderBottom: '2px solid #C297FF',
});

export function LoggedLayout({
  children,
  footer,
  showRefresh = false,
  showAddress = false,
  showBackButton = true,
}: {
  children: ReactNode;
  footer?: ReactNode;
  showRefresh?: boolean;
  showAddress?: boolean;
  showBackButton?: boolean;
}) {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');

  const { isLoading, authenticated } = useOwner();

  /** If user auth has expired, redirect to login page */
  useEffect(() => {
    const removeLastLocation = async () => {
      await Preferences.remove({
        key: 'lastLocation',
      });
    };

    if (!isLoading && !authenticated) {
      removeLastLocation();
    }
  }, [isLoading, authenticated]);

  if (isLoading) return <Spinner />;

  return (
    <IonPage>
      <LoggedHeader loggedIn={true} />
      <IonContent>
        <ChainDiv
          style={{ marginBottom: isMobile ? '8px' : '0px' }}
          routerLink={akashicPayPath(urls.loggedFunction)}
        >
          {t('AkashicChain')}
        </ChainDiv>
        <LoggedToolbar
          showAddress={showAddress}
          showRefresh={showRefresh}
          showBackButton={showBackButton}
        />
        {children}
      </IonContent>
      {footer && <IonFooter class={'ion-no-border'}>{footer}</IonFooter>}
    </IonPage>
  );
}
