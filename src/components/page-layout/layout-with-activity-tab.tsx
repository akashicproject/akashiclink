import type { ReactNode } from 'react';

import { DashboardLayout } from './dashboard-layout';

export function LayoutWithActivityTab({
  children,
  showRefresh = true,
  showAddress = true,
}: {
  children: ReactNode;
  showRefresh?: boolean;
  showAddress?: boolean;
}) {
  return (
    <DashboardLayout
      showRefresh={showRefresh}
      showAddress={showAddress}
      showSwitchAccountBar
    >
      {children}
    </DashboardLayout>
  );
}
