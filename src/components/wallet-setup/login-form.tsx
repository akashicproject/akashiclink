import { datadogRum } from '@datadog/browser-rum';
import { IonCol, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { historyResetStackAndRedirect } from '../../routing/history';
import { useFetchAndRemapAASToAddress } from '../../utils/hooks/useFetchAndRemapAASToAddress';
import { useFetchAndRemapL1Address } from '../../utils/hooks/useFetchAndRemapL1address';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/hooks/useIosScrollPasswordKeyboardIntoView';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { AccountSelection } from '../account-selection/account-selection';
import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../common/alert/alert';
import { PrimaryButton } from '../common/buttons';
import { StyledInput } from '../common/input/styled-input';
import { Spinner } from '../common/loader/spinner';

/**
 * Form allowing user to login
 * - Dropdown box showing user the locally imported accounts
 * - Password box
 * - Upload button triggering login request and redirect is successfull
 */
export function LoginForm({ isPopup = false }) {
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
  const [password, setPassword] = useState<string>('');
  const fetchAndRemapAASToAddress = useFetchAndRemapAASToAddress();

  const fetchAndRemapL1Address = useFetchAndRemapL1Address();

  addPrefixToAccounts();
  useIosScrollPasswordKeyboardIntoView();

  // fallback to the first wallet available if user delete logged in wallet
  useEffect(() => {
    if (!activeAccount && localAccounts?.[0]) {
      setActiveAccount(localAccounts?.[0]);
    }
  }, [activeAccount?.identity, localAccounts?.length]);

  const onClickLogin = async () => {
    try {
      setAlert(formAlertResetState);
      setIsLoading(true);

      if (!activeAccount || !password) {
        setAlert(errorAlertShell('ValidationError'));
        return;
      }

      const localSelectedOtk = await getLocalOtkAndCache(
        activeAccount.identity,
        password
      );

      if (!localSelectedOtk) {
        throw new Error(
          `localSelectedOtk not found may due to old account not migrated, ${activeAccount.identity}`
        );
      }

      datadogRum.setUser({
        id: activeAccount.username,
      });
      await fetchAndRemapAASToAddress(activeAccount.identity);
      await fetchAndRemapL1Address();
      setPassword('');
      historyResetStackAndRedirect();
    } catch (error) {
      datadogRum.addError(error);
      setAlert(errorAlertShell(unpackRequestErrorMessage(error)));
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
          <AccountSelection
            onSelectAccount={(a) => setActiveAccount(a)}
            currentSelectedAccount={activeAccount ?? localAccounts?.[0]}
            isPopup={isPopup}
          />
        </IonCol>
        <IonCol size="12">
          <StyledInput
            value={password}
            type={'password'}
            placeholder={t('Password')}
            onIonInput={({ detail: { value } }) => setPassword(value as string)}
            submitOnEnter={onClickLogin}
            enterkeyhint="go"
          />
        </IonCol>
        <IonCol size="12">
          <PrimaryButton
            onClick={onClickLogin}
            style={{ width: '100%' }}
            expand="block"
            disabled={!password}
          >
            {t('Unlock')}
          </PrimaryButton>
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
