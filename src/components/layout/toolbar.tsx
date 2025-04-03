import { IonIcon } from '@ionic/react';
import { useState } from 'react';

import { REFRESH_BUTTON_DISABLED_TIME } from '../../constants';
import type { Url } from '../../constants/urls';
import { urls } from '../../constants/urls';
import { historyGoBackOrReplace } from '../../routing/history';
import { themeType } from '../../theme/const';
import { useBalancesMe } from '../../utils/hooks/useBalancesMe';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useLogout } from '../../utils/hooks/useLogout';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';
import { AccountSelection } from '../account-selection/account-selection';
import { SquareWhiteButton } from '../common/buttons';
import { useTheme } from '../providers/PreferenceProvider';

export function Toolbar({
  showRefresh = false,
  showAddress = false,
  showBackButton = true,
  backButtonReplaceTarget = urls.dashboard,
}: {
  showRefresh?: boolean;
  showAddress?: boolean;
  showBackButton?: boolean;
  backButtonReplaceTarget?: Url;
}) {
  const { mutateTransfersMe } = useTransfersMe();
  const { mutateNftTransfersMe } = useNftTransfersMe();
  const { mutateBalancesMe } = useBalancesMe();
  const { mutateNftMe } = useNftMe();
  const logout = useLogout();
  const [storedTheme] = useTheme();
  const [refreshDisabled, setRefreshDisabled] = useState(false);

  const { setActiveAccount } = useAccountStorage();

  const onClickBackButton = () => {
    historyGoBackOrReplace(backButtonReplaceTarget);
  };

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
      {showBackButton && (
        <div style={{ flex: 0 }}>
          <SquareWhiteButton
            className="icon-button"
            onClick={onClickBackButton}
          >
            <IonIcon
              className="icon-button-icon"
              slot="icon-only"
              src={`/shared-assets/images/${
                storedTheme === themeType.DARK
                  ? 'back-arrow-white.svg'
                  : 'back-arrow-purple.svg'
              }`}
            />
          </SquareWhiteButton>
        </div>
      )}
      {showAddress && (
        <div style={{ flex: 1 }}>
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
          <SquareWhiteButton
            disabled={refreshDisabled}
            className="icon-button"
            id="refresh-button"
            onClick={async () => {
              try {
                setRefreshDisabled(true);
                await mutateTransfersMe();
                await mutateNftTransfersMe();
                await mutateBalancesMe();
                await mutateNftMe();
              } finally {
                // To prevent spam of the backend, disable the refresh button for a little while
                setTimeout(
                  () => setRefreshDisabled(false),
                  REFRESH_BUTTON_DISABLED_TIME
                );
              }
            }}
          >
            <IonIcon
              slot="icon-only"
              className="icon-button-icons"
              src={`/shared-assets/images/${
                storedTheme === themeType.DARK
                  ? 'refresh-dark.svg'
                  : 'refresh-light.svg'
              }`}
            />
          </SquareWhiteButton>
        </div>
      )}
    </div>
  );
}
