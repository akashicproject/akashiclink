import './layout.css';

import { IonPage } from '@ionic/react';
import type { ReactNode } from 'react';

import { Footer } from './footer';
import { LoggedHeader } from './logged-header';

const MaxWidth = '304px';
/**
 * Narrow layout for all public pages (before user has completed login)
 * With centered child content
 */
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <IonPage>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxWidth: MaxWidth,
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <LoggedHeader />
          </div>
          <div style={{ flexGrow: 2, overflow: 'scroll' }}>{children}</div>
          <Footer />
        </div>
      </div>
    </IonPage>
  );
}
