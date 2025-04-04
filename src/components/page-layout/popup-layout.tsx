import styled from '@emotion/styled';
import { IonGrid, IonHeader, IonPage } from '@ionic/react';
import { type ReactNode } from 'react';

import { PopupHeader } from '../../popup/popup-header';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { Footer } from '../layout/footer';
import { AccountListItem } from '../manage-account/account-list-item';

const StyledLayout = styled.div({
  ['& > .content']: {
    overflow: 'scroll',
  },
  ['& > .footer']: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export function PopupLayout({
  className,
  children,
  showIdentity = true,
}: {
  className?: string;
  children: ReactNode;
  showIdentity?: boolean;
}) {
  const { activeAccount } = useAccountStorage();

  return (
    <IonPage>
      <StyledLayout className="vertical public-layout">
        {showIdentity && (
          <IonHeader
            className="ion-no-border "
            style={{
              background: 'var(--ion-header-background)',
              height: '88px',
              minHeight: '88px',
            }}
          >
            {activeAccount && (
              <AccountListItem
                lines={'none'}
                account={activeAccount}
                forceLightMode
              />
            )}
          </IonHeader>
        )}
        {!showIdentity && <PopupHeader />}
        <div className={`h-100 content ${className ?? ''}`}>
          <IonGrid
            className={'h-100 ion-display-flex ion-flex-direction-column'}
          >
            {children}
          </IonGrid>
        </div>
      </StyledLayout>
      <Footer />
    </IonPage>
  );
}
