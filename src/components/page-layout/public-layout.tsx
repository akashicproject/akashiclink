import './public-layout.scss';

import { IonPage } from '@ionic/react';
import { type ReactNode } from 'react';

import { Footer } from '../layout/footer';
import { PublicHeader } from '../layout/public-header';

/**
 * Narrow layout for all public pages (before user has completed login)
 * With centered child content
 */
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
      <div className="vertical public-layout">
        <PublicHeader />
        <div className={`content ${className ?? ''}`} style={contentStyle}>
          {children}
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </IonPage>
  );
}
