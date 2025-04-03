import styled from '@emotion/styled';
import { IonFooter, IonPage } from '@ionic/react';
import { type ReactNode } from 'react';

import { Footer } from '../layout/footer';
import { PublicHeader } from '../layout/public-header';

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

export function PublicLayout({
  className,
  children,
  contentStyle,
}: {
  className?: string;
  children: ReactNode;
  contentStyle?: React.CSSProperties;
}) {
  return (
    <IonPage>
      <PublicHeader />
      <StyledLayout className="vertical public-layout">
        <div className={`content ${className ?? ''}`} style={contentStyle}>
          {children}
        </div>
      </StyledLayout>
      <Footer />
    </IonPage>
  );
}
