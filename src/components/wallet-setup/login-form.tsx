import { datadogRum } from '@datadog/browser-rum';
import { IonCol, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { historyResetStackAndRedirect } from '../../routing/history';
import { OwnersAPI } from '../../utils/api';
import { useBalancesMe } from '../../utils/hooks/useBalancesMe';
import { useFetchAndRemapAASToAddress } from '../../utils/hooks/useFetchAndRemapAASToAddress';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/hooks/useIosScrollPasswordKeyboardIntoView';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { useOwner } from '../../utils/hooks/useOwner';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';
import { signImportAuth } from '../../utils/otk-generation';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { AccountSelection } from '../account-selection/account-selection';
import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../common/alert/alert';
import { PurpleButton } from '../common/buttons';
import { StyledInput } from '../common/input/styled-input';
import { Spinner } from '../common/loader/spinner';

/**
 * Form allowing user to login
 * - Dropdown box showing user the locally imported accounts
 * - Password box
 * - Upload button triggering login request and redirect is successfull
 */
export function LoginForm() {
  const { getLocalOtkAndCache } = useAccountStorage();
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
  const { owner, mutateOwner } = useOwner();
  const { mutateTransfersMe } = useTransfersMe();
  const { mutateNftTransfersMe } = useNftTransfersMe();
  const { mutateBalancesMe } = useBalancesMe();
  const fetchAndRemapAASToAddress = useFetchAndRemapAASToAddress();

  addPrefixToAccounts();
  useIosScrollPasswordKeyboardIntoView();

  /**
   * Selection is populated on load to match the account save in session
   */
  useEffect(() => {
    if (selectedAccount && localAccounts.includes(selectedAccount)) {
      return;
    }
    if (activeAccount) {
      const matchingAccount = localAccounts?.find(
        (a) =>
          (typeof a.username !== 'undefined' &&
            a.username === activeAccount.username) ||
          a.identity === activeAccount.identity
      );
      setSelectedAccount(matchingAccount ?? localAccounts?.[0]);
    } else {
      setSelectedAccount(localAccounts?.[0]);
    }
  }, [activeAccount, localAccounts, owner]);

  const login = async () => {
    try {
      setAlert(formAlertResetState);
      setIsLoading(true);

      if (!selectedAccount || !password) {
        setAlert(errorAlertShell(t('ValidationError')));
        return;
      }

      const localSelectedOtk = await getLocalOtkAndCache(
        selectedAccount.identity,
        password
      );
      if (localSelectedOtk) {
        await OwnersAPI.loginV1({
          identity: localSelectedOtk.identity,
          signedAuth: signImportAuth(
            localSelectedOtk.key.prv.pkcs8pem,
            localSelectedOtk.identity
          ),
        });
      } else {
        // Check if supplied password is correct
        await OwnersAPI.validatePassword({
          username: selectedAccount.username ?? '',
          password,
        });
        // @TODO remove once old accounts no longer supported
        // Redirect to Migration-Flow
        historyResetStackAndRedirect(urls.migrateWalletNotice, {
          migrateWallet: {
            username: selectedAccount.username,
            oldPassword: password,
          },
        });
        return;
      }

      datadogRum.setUser({
        id: selectedAccount.username,
      });
      // Set the login account
      setActiveAccount(selectedAccount);
      await mutateOwner();
      await mutateTransfersMe();
      await mutateNftTransfersMe();
      await mutateBalancesMe();
      await fetchAndRemapAASToAddress();

      setSelectedAccount(undefined);
      setPassword('');
      historyResetStackAndRedirect();
    } catch (error) {
      datadogRum.addError(error);
      setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <CustomAlert state={alert} />
      <h1 className="ion-justify-content-center ion-margin-top-lg ion-margin-bottom-xs">
        {t('WelcomeBack')}
      </h1>
      <h3 className="ion-justify-content-center ion-margin-top-0 ion-margin-bottom-md">
        {t('EmpoweringYourWealth')}
      </h3>
      <IonRow className={'ion-grid-gap-xs'}>
        <IonCol size="12">
          <AccountSelection onNewAccountClick={(a) => setSelectedAccount(a)} />
        </IonCol>
        <IonCol size="12">
          <StyledInput
            value={password}
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
