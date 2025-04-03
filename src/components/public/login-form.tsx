import { IonCol, IonRow, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { AccountSelection } from '../account-selection/account-selection';
import { Alert, errorAlertShell, formAlertResetState } from '../alert/alert';
import { PurpleButton } from '../buttons';
import { StyledInput } from '../styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { OwnersAPI } from '../../utils/api';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

// TODO: re-enable once password recovery loop is implemented
// const HelpLink = styled.a({
//   textDecoration: 'none',
// });

/**
 * Form allowing user to login
 * - Dropdown box showing user the locally imported accounts
 * - Password box
 * - Upload button triggering login request and redirect is successfull
 */
export function LoginForm() {
  const history = useHistory();
  const { t } = useTranslation();
  const [alert, setAlert] = useState(formAlertResetState);

  const { localAccounts, activeAccount, setActiveAccount } =
    useAccountStorage();
  const [selectedAccount, setSelectedAccount] = useState<LocalAccount>();
  const [password, setPassword] = useState<string>();

  useEffect(() => {
    if (!selectedAccount && localAccounts.length)
      setSelectedAccount(localAccounts[0]);
  });

  /**
   * Ensures that selectedAccount in the dropdown menu matches the activeAccount
   */
  useEffect(() => {
    setTimeout(() => {
      if (activeAccount && selectedAccount && activeAccount !== selectedAccount)
        isPlatform('mobile') && location.reload();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount, window.location.pathname]);

  /**
   * Perform login - if 201 is returned, attempt to fetch some data:
   * - 401 means that 2fa has not been passed yet
   * - 200 means that 2fa is not required by backend
   */
  const login = async () => {
    try {
      if (selectedAccount && password) {
        await OwnersAPI.login({
          username: selectedAccount.username,
          password,
        });
        // Set the login account
        setActiveAccount(selectedAccount);
        history.push(akashicPayPath(urls.loggedFunction));
      }
    } catch (error) {
      setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
    }
  };

  return (
    <>
      <Alert state={alert} />
      <h1 className="ion-justify-content-center">{t('WelcomeBack')}</h1>
      <h3 className="ion-justify-content-center">
        {t('YourMostReliableWallet')}
      </h3>
      <AccountSelection
        changeSelection={(a) => setSelectedAccount(a)}
        style={{ marginTop: '24px' }}
      />
      <IonRow>
        <IonCol>
          <StyledInput
            label={t('Password')}
            type={'password'}
            placeholder={t('PleaseEnterYourPassword')}
            onIonInput={({ target: { value } }) => setPassword(value as string)}
            submitOnEnter={login}
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <PurpleButton onClick={login} expand="block" disabled={!password}>
            {t('Unlock')}
          </PurpleButton>
        </IonCol>
      </IonRow>
      {/* TODO: re-enable once password recovery loop is implemented */}
      {/* <IonRow style={{ marginTop: '-10px' }}>
        <IonCol>
          <h3>
            <HelpLink href="https://akashicpay.com">
              {t('ForgotYourPassword')}
            </HelpLink>
          </h3>
        </IonCol>
      </IonRow> */}
    </>
  );
}
