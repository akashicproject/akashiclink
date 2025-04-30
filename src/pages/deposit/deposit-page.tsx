import { CurrencyQrCodeAddress } from '../../components/deposit/currency-qr-code-address';
import { LayoutWithActivityTab } from '../../components/page-layout/layout-with-activity-tab';

export function DepositPage() {
  return (
    <LayoutWithActivityTab showRefresh={false} showAddress={false}>
      <CurrencyQrCodeAddress />
    </LayoutWithActivityTab>
  );
}
