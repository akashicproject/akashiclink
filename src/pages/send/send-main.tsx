import type { ReactNode } from 'react';

import { DashboardLayout } from '../../components/page-layout/dashboard-layout';

export const SendMain: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <DashboardLayout showAddress>{children}</DashboardLayout>;
};
