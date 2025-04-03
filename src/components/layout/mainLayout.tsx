import './layout.css';

import { IonContent, IonGrid, IonPage } from '@ionic/react';
import type { ReactNode } from 'react';

import { Footer } from './footer';
import { LoggedHeader } from './logged-header';

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <IonPage>
      <IonGrid class="main-wrapper">
        <LoggedHeader />
        <IonContent class="no-scroll">{children}</IonContent>
        <Footer />
      </IonGrid>
    </IonPage>
  );
};
