import './layout.css';

import { IonGrid } from '@ionic/react';
import type { ReactNode } from 'react';

export const MainGrid: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <IonGrid class={'middle'}>{children}</IonGrid>;
};
