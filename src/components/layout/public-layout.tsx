import './public-layout.scss';

import { IonPage } from '@ionic/react';
import type { ReactNode } from 'react';

import { Footer } from './footer';
import { LoggedHeader } from './logged-header';

/**
 * Narrow layout for all public pages (before user has completed login)
 * With centered child content
 */
export function PublicLayout({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <IonPage>
      <div className="vertical public-layout">
        <LoggedHeader />
        <div className={`content ${className}`}>{children}</div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </IonPage>
  );
}
