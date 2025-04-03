import styled from '@emotion/styled';
import {
  IonContent,
  IonFooter,
  IonPage,
  IonRouterLink,
  isPlatform,
  useIonViewWillEnter,
} from '@ionic/react';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { useOwner } from '../../utils/hooks/useOwner';
import { lastPageStorage } from '../../utils/last-page-storage';
import { delay } from '../../utils/timer-function';
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
}: {
  children: ReactNode;
  footer?: ReactNode;
  isRefresh?: boolean;
}) {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const ChainDivMarginBottom = isMobile ? '5px' : '0px';

  const loginCheck = useOwner();

  /** If user auth has expired, redirect to login page */
  useEffect(
    () => {
      const callLogout = async () => {
        if (!loginCheck.isLoading && !loginCheck.authenticated) {
          await lastPageStorage.clear();
        }
      };
      callLogout();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginCheck.isLoading]
  );

  const [spin, setSpin] = useState(false);

  useIonViewWillEnter(async () => {
    const isSpinner = localStorage.getItem('spinner');
    if (isSpinner === 'true') {
      setSpin(true);
      await delay(4500);
      setSpin(false);
      localStorage.removeItem('spinner');
    }
  });

  return (
    <IonPage>
      {spin && <Spinner />}
      <LoggedHeader loggedIn={true} />
      <IonContent>
        <ChainDiv
          style={{ marginBottom: ChainDivMarginBottom }}
          routerLink={akashicPayPath(urls.loggedFunction)}
        >
          {t('AkashicChain')}
        </ChainDiv>
        <LoggedToolbar isRefresh={isRefresh} />
        {children}
      </IonContent>
      {footer && <IonFooter class={'ion-no-border'}>{footer}</IonFooter>}
    </IonPage>
  );
}
