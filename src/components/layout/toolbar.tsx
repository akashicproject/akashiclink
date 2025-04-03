import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { useState } from 'react';

import { REFRESH_BUTTON_DISABLED_TIME } from '../../constants';
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
import { SettingsPopover } from './settings-popover/settings-popover';

export function Toolbar({
  showRefresh = false,
  showAddress = false,
  showBackButton = true,
}: {
  showRefresh?: boolean;
  showAddress?: boolean;
  showBackButton?: boolean;
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
    historyGoBackOrReplace(urls.dashboard);
  };

  return (
    <IonGrid
      className="ion-no-padding"
      style={{ padding: '16px 24px 0px', height: 'auto' }}
      fixed
    >
      <IonRow style={{ gap: '8px' }}>
        {showBackButton && (
          <IonCol
            className="ion-no-padding"
            size="auto"
            style={{
              width: '10%',
            }}
          >
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
          </IonCol>
        )}
        <IonCol
          className="ion-no-padding"
          style={{
            width: '71%',
            flex: '1 0 71%',
          }}
        >
          {showAddress && (
            <AccountSelection
              showCopyButton={true}
              onNewAccountClick={(selectedAccount) => {
                // When a different account is clicked, set it as the active account and logout
                setActiveAccount(selectedAccount);
                logout();
              }}
            />
          )}
        </IonCol>
        {showRefresh && (
          <IonCol className="ion-no-padding" size="auto">
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
          </IonCol>
        )}
        <IonCol
          className="ion-no-padding"
          style={{
            width: '10%',
          }}
        >
          <SettingsPopover />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
