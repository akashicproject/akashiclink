import styled from '@emotion/styled';
import { IonGrid, IonHeader, IonPage } from '@ionic/react';
import { type ReactNode } from 'react';

import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { displayLongText } from '../../utils/long-text';
import { Divider } from '../common/divider';
import { Footer } from '../layout/footer';

const StyledLayout = styled.div({
  ['& > .content']: {
    padding: '0 24px',
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
          <>
            <IonHeader
              className="ion-no-border"
              style={{
                background: 'var(--ion-background-color)',
              }}
            >
              <h4>
                {`Connecting with ${displayLongText(activeAccount?.identity)}`}
              </h4>
            </IonHeader>
            <Divider className={'w-100'} />
          </>
        )}
        <div className={`h-100 ${className ?? ''}`}>
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
