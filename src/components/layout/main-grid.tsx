import './layout.css';

import { IonGrid } from '@ionic/react';
import type { ComponentProps } from 'react';

/**
 * Grid that is:
 * - Centered
 * - Fills up all available space
 * TODO: rename to FillGrid
 */
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
