import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSWRConfig } from 'swr';

import { urls } from '../../constants/urls';
import { themeType } from '../../theme/const';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { AccountSelection } from '../account-selection/account-selection';
import { SquareWhiteButton } from '../buttons';
import { useLogout } from '../logout';
import { useTheme } from '../PreferenceProvider';
import { SettingsPopover } from '../settings/settings-popover';

export function LoggedToolbar({
  backButtonUrl = urls.loggedFunction,
  showRefresh = false,
  showAddress = false,
  showBackButton = true,
}: {
  backButtonUrl?: string;
  showRefresh?: boolean;
  showAddress?: boolean;
  showBackButton?: boolean;
}) {
  // Mutate is ued to to trigger a revalidation
  const { mutate } = useSWRConfig();
  const logout = useLogout();
  const history = useHistory();
  const [storedTheme] = useTheme();
  const [refreshDisabled, setRefreshDisabled] = useState(false);

  const { setActiveAccount } = useAccountStorage();

  return (
    <IonGrid
      className="ion-no-padding"
      style={{ padding: '16px 24px 0px', height: 'auto' }}
      fixed
    >
      <IonRow style={{ gap: '8px' }}>
        {showBackButton && (
          <>
            <IonCol
              className="ion-no-padding"
              size="auto"
              style={{
                width: '10%',
              }}
            >
              <SquareWhiteButton
                className="icon-button"
                onClick={() => history.push(backButtonUrl)}
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
          </>
        )}
        <IonCol
          className="ion-no-padding"
          style={{
            width: '71%',
            flex: '0 0 71%',
          }}
        >
          {showAddress && (
            <AccountSelection
              showCopyButton={true}
              onNewAccountClick={async (selectedAccount) => {
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
                  await mutate(
                    (key) =>
                      typeof key === 'string' &&
                      key.startsWith('/key/transfers/me')
                  );
                  await mutate(
                    (key) =>
                      typeof key === 'string' &&
                      key.startsWith('/nft/transfers/me')
                  );
                  await mutate('/owner/agg-balances');
                } finally {
                  setRefreshDisabled(false);
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
