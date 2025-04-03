import styled from '@emotion/styled';
import { IonCol, IonGrid, IonRow, IonSpinner, isPlatform } from '@ionic/react';
import { useState } from 'react';

import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { AccountSelection } from '../account-selection/account-selection';
import { useLogout } from '../logout';
import { SettingsPopover } from '../settings/settings-popover';

const Divider = styled.div({
  width: '2px',
  height: '100%',
  background: '#D9D9D9',
});

export function LoggedToolbar() {
  const logout = useLogout();

  const { setActiveAccount } = useAccountStorage();
  // const [logoutTrigger, setLogoutTrigger] = useState<LocalAccount>();
  const [pending, setPending] = useState(false);

  return (
    <IonGrid fixed>
      <IonRow class="ion-justify-content-around">
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
        <IonCol size="1" class="ion-center">
          <Divider />
        </IonCol>
        <IonCol size="auto">
          <SettingsPopover />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
