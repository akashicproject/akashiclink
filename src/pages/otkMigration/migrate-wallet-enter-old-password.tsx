import type { IKeyExtended } from '@activeledger/sdk-bip39';
import { datadogRum } from '@datadog/browser-rum';
import { IonCol, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { urls } from '../../constants/urls';
import { historyGoBack } from '../../routing/history-stack';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../../utils/last-page-storage';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

export function MigrateWalletOldPassword() {
  const { t } = useTranslation();
  const history = useHistory();

  /** Tracking user input */
  const [password, setPassword] = useState<string>();

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const [alert, setAlert] = useState(formAlertResetState);

  useEffect(() => {
    cacheCurrentPage(
      urls.migrateWalletOldPassword,
      NavigationPriority.IMMEDIATE,
      async () => {
        const data = await lastPageStorage.getVars();
        if (data.password) {
          setPassword(data.password);
        }
      }
    );
  }, []);

  async function confirmOldPassword() {
    if (!password) return;

    try {
      const {
        otk,
        username,
        passPhrase,
      }: { otk: IKeyExtended; username: string; passPhrase: string } =
        await lastPageStorage.getVars();

      setAlert(formAlertResetState);
      await lastPageStorage.clear();

      lastPageStorage.store(
        urls.migrateWalletSecret,
        NavigationPriority.IMMEDIATE,
        {
          username,
          oldPassword: password,
          passPhrase,
          otk,
        }
      );

      setPassword(undefined);
      history.push(urls.migrateWalletSecret);
    } catch (e) {
      datadogRum.addError(e);
      setAlert(errorAlertShell(t('GenericFailureMsg')));
    }
  }

  /**
   * Redirect user to previous page, and reset page state
   */
  const CancelButton = (
    <IonCol>
      <ResetPageButton
        expand="block"
        callback={() => {
          historyGoBack(history, true);
        }}
      />
    </IonCol>
  );
  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow>
          <IonCol>
            <h2>{t('PleaseEnterYourPassword')}</h2>
          </IonCol>
        </IonRow>

        <>
          <IonRow>
            <AlertBox state={alert} />
          </IonRow>

          <IonRow>
            <IonCol>
              <StyledInput
                label={t('Password')}
                placeholder={t('EnterPassword')}
                type="password"
                onIonInput={({ target: { value } }) =>
                  setPassword(value as string)
                }
                value={password}
                errorPrompt={StyledInputErrorPrompt.Password}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <PurpleButton
                expand="block"
                onClick={confirmOldPassword}
                disabled={!password}
              >
                {t('Confirm')}
              </PurpleButton>
            </IonCol>
            {CancelButton}
          </IonRow>
        </>
      </MainGrid>
    </PublicLayout>
  );
}
