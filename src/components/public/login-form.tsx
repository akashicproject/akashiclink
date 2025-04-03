import { IonCol, IonRow, isPlatform, useIonViewWillLeave } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { datadogRum } from '@datadog/browser-rum';

import { AccountSelection } from '../account-selection/account-selection';
import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../alert/alert';
import { PurpleButton } from '../buttons';
import { StyledInput } from '../styled-input';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { OwnersAPI } from '../../utils/api';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { mutate } from 'swr';
import { signImportAuth } from '../../utils/otk-generation';

/**
 * Form allowing user to login
 * - Dropdown box showing user the locally imported accounts
 * - Password box
 * - Upload button triggering login request and redirect is successfull
 */
export function LoginForm() {
  const { getLocalOtkAndCache } = useAccountStorage();
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
    if (selectedAccount) {
      return;
    }
    if (activeAccount) {
      const matchingAccount = localAccounts?.find(
        (a) =>
          a.username === activeAccount.username ||
          a.identity === activeAccount.identity
      );
      setSelectedAccount(matchingAccount);
    } else {
      setSelectedAccount(localAccounts?.[0]);
    }
  }, [activeAccount, localAccounts]);

  const login = async () => {
    try {
      setIsLoading(true);
      // await delay(5000);
      if (selectedAccount && password) {
        const localSelectedOtk = await getLocalOtkAndCache(
          selectedAccount.identity,
          password
        );
        if (localSelectedOtk) {
          await OwnersAPI.loginV1({
            identity: localSelectedOtk.identity!,
            signedAuth: signImportAuth(
              localSelectedOtk.key.prv.pkcs8pem,
              localSelectedOtk.identity!
            ),
          });
        } else {
          // @TODO remove once old accounts no longer supported
          // Redirect to Migration-Flow
          history.push({
            pathname: akashicPayPath(urls.migrateWalletNotice),
            state: {
              migrateWallet: {
                username: selectedAccount.username,
                oldPassword: password,
              },
            },
          });
          setIsLoading(false);
          return;
        }

        datadogRum.setUser({
          id: selectedAccount.username,
        });
        // Set the login account
        setIsLoading(false);
        setActiveAccount(selectedAccount);
        localStorage.setItem('spinner', 'true');
        await mutate(`/owner/me`);
        history.push(akashicPayPath(urls.loggedFunction));
      }
    } catch (error) {
      datadogRum.addError(error);
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
      <IonRow className={'ion-grid-gap-md ion-margin-top-lg'}>
        <IonCol size="12">
          <AccountSelection onNewAccountClick={(a) => setSelectedAccount(a)} />
        </IonCol>
        <IonCol size="12">
          <StyledInput
            type={'password'}
            placeholder={t('Password')}
            onIonInput={({ target: { value } }) => setPassword(value as string)}
            submitOnEnter={login}
            enterkeyhint="go"
          />
        </IonCol>
        <IonCol size="12">
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
