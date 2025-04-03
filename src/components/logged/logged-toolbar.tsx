import {
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
  isPlatform,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { AccountSelection } from '../account-selection/account-selection';
import { SquareWhiteButton } from '../buttons';
import { useLogout } from '../logout';
import { SettingsPopover } from '../settings/settings-popover';

export function LoggedToolbar() {
  const logout = useLogout();
  const history = useHistory();

  const { setActiveAccount } = useAccountStorage();
  // const [logoutTrigger, setLogoutTrigger] = useState<LocalAccount>();
  const [pending, setPending] = useState(false);

  return (
    <IonGrid fixed>
      <IonRow class="ion-justify-content-around">
        <IonCol size="auto">
          <SquareWhiteButton
            class="icon-button"
            onClick={() => history.goBack()}
          >
            <IonIcon
              class="icon-button-icon"
              slot="icon-only"
              icon={arrowBack}
            />
          </SquareWhiteButton>
        </IonCol>
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
        <IonCol size="auto">
          <SettingsPopover />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
