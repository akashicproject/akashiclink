import { IonCol, IonRow, isPlatform, useIonViewWillLeave } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';

import { AccountSelection } from '../account-selection/account-selection';
import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../alert/alert';
import { PurpleButton } from '../buttons';
import { StyledInput } from '../styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { OwnersAPI } from '../../utils/api';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { mutate } from 'swr';

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
  const [isLoading, setIsLoading] = useState(false);
  const {
    localAccounts,
    addPrefixToAccounts,
    activeAccount,
    setActiveAccount,
  } = useAccountStorage();
  const [selectedAccount, setSelectedAccount] = useState<LocalAccount>();
  const [password, setPassword] = useState<string>();

  addPrefixToAccounts();

  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  /**
   * Selection is populated on load to match the account save in session
   */
  useEffect(() => {
    if (!selectedAccount) {
      if (activeAccount) {
        const matchingAccount = localAccounts?.find(
          (a) => a.username === activeAccount.username
        );
        setSelectedAccount(matchingAccount);
      } else {
        setSelectedAccount(localAccounts?.[0]);
      }
    }
  }, [activeAccount, localAccounts]);

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
      setIsLoading(true);
      // await delay(5000);
      if (selectedAccount && password) {
        await OwnersAPI.login({
          username: selectedAccount.username,
          password,
        });
        // Set the login account
        setIsLoading(false);
        setActiveAccount(selectedAccount);
        localStorage.setItem('spinner', 'true');
        mutate(`/owner/me`);
        history.push(akashicPayPath(urls.loggedFunction));
      }
    } catch (error) {
      setIsLoading(false);
      setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
    }
  };

  return (
    <>
      <CustomAlert state={alert} />
      <h1 className="ion-justify-content-center">{t('WelcomeBack')}</h1>
      <h3 className="ion-justify-content-center">
        {t('EmpoweringYourWealth')}
      </h3>
      <AccountSelection
        onNewAccountClick={(a) => setSelectedAccount(a)}
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
            enterkeyhint="go"
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <PurpleButton
            onClick={login}
            style={{ width: '100%' }}
            expand="block"
            disabled={!password}
          >
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
