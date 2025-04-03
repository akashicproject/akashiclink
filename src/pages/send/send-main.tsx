import type { ReactNode } from 'react';

import { MainGrid } from '../../components/layout/main-grid';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';

export const SendMain: React.FC<{ children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <DashboardLayout showBackButton={false} showAddress {...props}>
      <MainGrid
        className={'ion-grid-row-gap-md'}
        style={{ padding: '32px 32px 8px' }}
      >
        {children}
      </MainGrid>
    </DashboardLayout>
  );
};
