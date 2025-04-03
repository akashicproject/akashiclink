import type { Url } from '../../constants/urls';
import { urls } from '../../constants/urls';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useLogout } from '../../utils/hooks/useLogout';
import { AccountSelection } from '../account-selection/account-selection';
import { RefreshDataButton } from './refresh-data-button';

export function Toolbar({
  showRefresh = false,
  showAddress = false,
}: {
  showRefresh?: boolean;
  showAddress?: boolean;
  showBackButton?: boolean;
  backButtonReplaceTarget?: Url;
}) {
  const logout = useLogout();

  const { setActiveAccount } = useAccountStorage();

  return (
    <div
      style={{
        padding: '12px 24px',
        height: 'auto',
        display: 'flex',
        gap: '8px',
        justifyContent: 'space-between',
      }}
    >
      {showAddress && (
        <div
          style={{
            flex: 1,
            maxWidth: 'calc(100vw - 24px - 24px - 32px - 8px)',
          }}
        >
          <AccountSelection
            size={'md'}
            showCopyButton={true}
            onNewAccountClick={(selectedAccount) => {
              // When a different account is clicked, set it as the active account and logout
              setActiveAccount(selectedAccount);
              logout();
            }}
          />
        </div>
      )}
      {showRefresh && (
        <div style={{ flex: 0 }}>
          <RefreshDataButton />
        </div>
      )}
    </div>
  );
}
