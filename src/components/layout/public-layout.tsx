import './public-layout.scss';

import { IonPage, useIonViewWillEnter } from '@ionic/react';
import { type ReactNode, useState } from 'react';

import { delay } from '../../utils/timer-function';
import { Spinner } from '../loader/spinner';
import { Footer } from './footer';
import { LoggedHeader } from './logged-header';

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
      {spin && <Spinner header={'ImportingYourWallet'} />}
      <div className="vertical public-layout">
        <LoggedHeader />
        <div className={`content ${className}`} style={contentStyle}>
          {children}
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </IonPage>
  );
}
