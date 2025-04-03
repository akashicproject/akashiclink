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

import { LAST_HISTORY_ENTRIES } from '../../constants';
import { urls } from '../../constants/urls';
import { history } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useOwner } from '../../utils/hooks/useOwner';
import { Spinner } from '../common/loader/spinner';
import { Header } from '../layout/header';
import { Toolbar } from '../layout/toolbar';

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

export function DashboardLayout({
  children,
  footer,
  showRefresh = false,
  showAddress = false,
  showBackButton = true,
  showChainDiv = true,
  showToolbar = true,
}: {
  children: ReactNode;
  footer?: ReactNode;
  showRefresh?: boolean;
  showAddress?: boolean;
  showBackButton?: boolean;
  showChainDiv?: boolean;
  showToolbar?: boolean;
}) {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const { isLoading, authenticated } = useOwner();

  /** If user auth has expired, redirect to login page */
  useEffect(() => {
    const updateLastLocation = async () => {
      if (!authenticated) {
        await Preferences.remove({
          key: LAST_HISTORY_ENTRIES,
        });
      } else {
        await Preferences.set({
          key: LAST_HISTORY_ENTRIES,
          value: JSON.stringify(history.entries),
        });
      }
    };

    if (!isLoading) {
      updateLastLocation();
    }
  }, [isLoading, authenticated, history]);

  if (isLoading) return <Spinner />;

  return (
    <IonPage>
      <Header />
      <IonContent>
        {showChainDiv && (
          <ChainDiv
            style={{ marginBottom: isMobile ? '8px' : '0px' }}
            routerLink={akashicPayPath(urls.dashboard)}
          >
            {t('AkashicChain')}
          </ChainDiv>
        )}
        {showToolbar && (
          <Toolbar
            showAddress={showAddress}
            showRefresh={showRefresh}
            showBackButton={showBackButton}
          />
        )}
        {children}
      </IonContent>
      {footer && <IonFooter class={'ion-no-border'}>{footer}</IonFooter>}
    </IonPage>
  );
}
