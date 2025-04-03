import styled from '@emotion/styled';
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
  isPlatform,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { themeType } from '../../theme/const';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { AccountSelection } from '../account-selection/account-selection';
import { SquareWhiteButton } from '../buttons';
import { useLogout } from '../logout';
import { useTheme } from '../PreferenceProvider';
import { SettingsPopover } from '../settings/settings-popover';

const HorizontalDivider = styled.div({
  border: '2px solid #D9D9D9',
  margin: '5px',
  height: '40px',
});
// In seconds
const TIMEOUT = 5 * 60;

export function LoggedToolbar({
  backButtonUrl = urls.loggedFunction,
  isRefresh = false,
}: {
  backButtonUrl?: string;
  isRefresh?: boolean;
}) {
  const logout = useLogout();
  const history = useHistory();
  const isDashboard =
    history.location.pathname === `/akashic/${urls.loggedFunction}`;
  const [storedTheme] = useTheme();

  const { setActiveAccount } = useAccountStorage();
  // const [logoutTrigger, setLogoutTrigger] = useState<LocalAccount>();
  const [pending, setPending] = useState(false);

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
    <IonGrid fixed>
      <IonRow class="ion-justify-content-center">
        {isDashboard ? null : (
          <>
            <IonCol size="auto">
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
            <HorizontalDivider />
          </>
        )}
        {pending ? (
          <IonCol size="1">
            <IonSpinner />
          </IonCol>
        ) : (
          <IonCol size="8">
            <AccountSelection
              isCopyButton={true}
              onClickCallback={(selectedAccount) => {
                setPending(true);
                setActiveAccount(selectedAccount);
                // This sequence ensures that the activeAccount
                // has time to update before logout occurs
                // This ensures that the selected account
                // is filled in for login
                setTimeout(() => {
                  setPending(false);
                  logout().then(
                    () => isPlatform('mobile') && location.reload()
                  );
                }, 500);
              }}
            />
          </IonCol>
        )}
        <IonCol size="auto" hidden={!isRefresh}>
          <SquareWhiteButton
            class="icon-button"
            onClick={() => {
              location.reload();
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
        <IonCol size="auto">
          <SettingsPopover />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
