import { Preferences } from '@capacitor/preferences';
import styled from '@emotion/styled';
import { IonContent, IonFooter, IonPage, IonRouterLink } from '@ionic/react';
import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LAST_PAGE_LOCATION } from '../../constants';
import { urls } from '../../constants/urls';
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
  showSetting = true,
}: {
  children: ReactNode;
  footer?: ReactNode;
  showRefresh?: boolean;
  showAddress?: boolean;
  showBackButton?: boolean;
  showSetting?: boolean;
}) {
  const { t } = useTranslation();

  const { isLoading, authenticated } = useOwner();

  /** If user auth has expired, redirect to login page */
  useEffect(() => {
    const removeLastLocation = async () => {
      await Preferences.remove({
        key: LAST_PAGE_LOCATION,
      });
    };

    if (!isLoading && !authenticated) {
      removeLastLocation();
    }
  }, [isLoading, authenticated]);

  if (isLoading) return <Spinner />;

  return (
    <IonPage>
      <Header />
      <IonContent>
        <ChainDiv routerLink={akashicPayPath(urls.dashboard)}>
          {t('AkashicChain')}
        </ChainDiv>
        <Toolbar
          showAddress={showAddress}
          showRefresh={showRefresh}
          showBackButton={showBackButton}
          showSetting={showSetting}
        />
        {children}
      </IonContent>
      {footer && <IonFooter class={'ion-no-border'}>{footer}</IonFooter>}
    </IonPage>
  );
}
