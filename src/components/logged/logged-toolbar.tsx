import { IonCol, IonGrid, IonIcon, IonRow, isPlatform } from '@ionic/react';
import { useEffect } from 'react';
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

// In seconds
const TIMEOUT = 5 * 60;

export function LoggedToolbar({
  backButtonUrl = urls.loggedFunction,
  isRefresh = false,
}: {
  backButtonUrl?: string;
  isRefresh?: boolean;
}) {
  // Mutate is ued to to trigger a revalidation
  const { mutate } = useSWRConfig();
  const logout = useLogout();
  const history = useHistory();
  const isDashboard =
    history.location.pathname === `/akashic/${urls.loggedFunction}`;
  const [storedTheme] = useTheme();

  const { setActiveAccount } = useAccountStorage();

  /** Track inactivity - user logged out if no movement has occured for 5 minutes */
  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;

    // Function to reset the inactivity timer
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(
        () => logout().then(() => isPlatform('mobile') && location.reload()),
        TIMEOUT * 1000
      );
    };

    // Add event listeners when component mounts
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);

    // Start the inactivity timer when the component mounts
    resetInactivityTimer();

    // Remove event listeners and clear the timer when the component unmounts
    return () => {
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
      clearTimeout(inactivityTimer);
    };
  }, []);

  return (
    <IonGrid
      className="ion-no-padding"
      style={{ padding: '16px 24px 0px', height: 'auto' }}
      fixed
    >
      <IonRow style={{ gap: '8px' }}>
        {isDashboard ? null : (
          <>
            <IonCol
              className="ion-no-padding"
              size="auto"
              style={{
                width: '10%',
              }}
            >
              <SquareWhiteButton
                class="icon-button"
                onClick={() => history.push(backButtonUrl)}
              >
                <IonIcon
                  class="icon-button-icon"
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
          }}
        >
          <AccountSelection
            showCopyButton={true}
            onNewAccountClick={async (selectedAccount) => {
              // When a different account is clicked, set it as the active account and logout
              setActiveAccount(selectedAccount);
              logout().then(() => isPlatform('mobile') && location.reload());
            }}
          />
        </IonCol>
        <IonCol className="ion-no-padding" hidden={!isRefresh} size="auto">
          <SquareWhiteButton
            class="icon-button"
            id="refresh-button"
            onClick={() => {
              mutate(
                (key) =>
                  typeof key === 'string' && key.startsWith('/key/transfers/me')
              );
              mutate('/owner/agg-balances');
            }}
          >
            <IonIcon
              slot="icon-only"
              class="icon-button-icons"
              src={`/shared-assets/images/${
                storedTheme === themeType.DARK
                  ? 'refresh-dark.svg'
                  : 'refresh-light.svg'
              }`}
            />
          </SquareWhiteButton>
        </IonCol>
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
