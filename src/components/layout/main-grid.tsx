import './layout.css';

import { IonGrid } from '@ionic/react';
import type { ComponentProps } from 'react';

export function MainGrid({
  children,
  ...props
}: ComponentProps<typeof IonGrid>) {
  return (
    <IonGrid {...props} fixed class="middle">
      {children}
    </IonGrid>
  );
}
