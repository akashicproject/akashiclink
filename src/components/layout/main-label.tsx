import './layout.css';

import { IonLabel } from '@ionic/react';
import type { ReactNode } from 'react';

export const MainLabel: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <IonLabel class={'main-label'} position={'stacked'}>
      {children}
    </IonLabel>
  );
};
