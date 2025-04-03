import './layout.css';

import { IonContent, IonPage } from '@ionic/react';
import type { ReactNode } from 'react';

import { Footer } from './footer';
import { MainHeader } from './main-header';

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <IonPage>
      <MainHeader />
      <IonContent class="no-scroll">{children}</IonContent>
      <Footer />
    </IonPage>
  );
};
