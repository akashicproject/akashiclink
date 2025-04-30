import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { SendForm } from '../../components/send/send-form/send-form';

export function SendPage() {
  return (
    <DashboardLayout showSwitchAccountBar showAddress>
      <SendForm />
    </DashboardLayout>
  );
}
