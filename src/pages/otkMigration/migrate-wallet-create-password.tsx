import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import { userConst } from '@helium-pay/backend';
import { IonCheckbox, IonCol, IonRow } from '@ionic/react';
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
import { akashicPayPath } from '../../routing/navigation-tabs';
import { OwnersAPI } from '../../utils/api';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../../utils/last-page-storage';
import type { FullOtk } from '../../utils/otk-generation';
import { signImportAuth } from '../../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

export const CreatePasswordInfo = styled.p({
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
});

export function MigrateWalletCreatePassword() {
  const { t } = useTranslation();
  const history = useHistory();

  /** Tracking user input */
  const [password, setPassword] = useState<string>();
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const validateConfirmPassword = (value: string) => password === value;
  const [checked, setChecked] = useState(false);

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const [alert, setAlert] = useState(formAlertResetState);

  const { addLocalAccount, setActiveAccount, addLocalOtkAndCache } =
    useAccountStorage();

  useEffect(() => {
    cacheCurrentPage(
      urls.migrateWalletPassword,
      NavigationPriority.IMMEDIATE,
      async () => {
        const data = await lastPageStorage.getVars();
        if (data.password) {
          setPassword(data.password);
          setConfirmPassword(data.confirmPassword);
        }
      }
    );
  }, []);

  /**
   * Validates Password and migrates from BE-otk to FE-otk
   */
  async function confirmPasswordAndMigrateOtk() {
    if (!(password && confirmPassword && checked)) return;

    if (
      validateConfirmPassword(confirmPassword) &&
      validatePassword(password)
    ) {
      try {
        const {
          otk,
          username,
          oldPassword,
        }: { otk: FullOtk; username: string; oldPassword: string } =
          await lastPageStorage.getVars();

        // Login With v0-api to be authenticated for swap-endpoint
        await OwnersAPI.login({
          username,
          password: oldPassword,
        });

        // Transfers permissions from server-side OTK to the just-generated client-side otk
        const { identity } = await OwnersAPI.swapEotkToOtk(
          otk.key.pub.pkcs8pem
        );

        setAlert(formAlertResetState);
        await lastPageStorage.clear();

        // Set new account details and display summary screen
        const newAccount = {
          identity,
        };
        addLocalOtkAndCache({ ...otk, identity }, password);
        addLocalAccount(newAccount);
        setActiveAccount(newAccount);

        // Login so user is authenticated
        await OwnersAPI.loginV1({
          identity,
          signedAuth: signImportAuth(otk.key.prv.pkcs8pem, identity),
        });

        setPassword(undefined);
        setConfirmPassword(undefined);

        history.push({
          pathname: akashicPayPath(urls.migrateWalletComplete),
        });
      } catch (e) {
        datadogRum.addError(e);
        setAlert(errorAlertShell(t('GenericFailureMsg')));
      }
    } else setAlert(errorAlertShell(t('PasswordHelperText')));
  }

  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow className="ion-grid-row-gap-lg">
          <IonCol size="12">
            <h2 className={'ion-margin-bottom-xxs'}>{t('CreatePassword')}</h2>
            <CreatePasswordInfo
              className={'ion-margin-0 ion-text-align-center ion-text-size-xs'}
            >
              {t('CreatePasswordInfo')}
            </CreatePasswordInfo>
          </IonCol>
          <IonCol size="12">
            <StyledInput
              label={t('Password')}
              placeholder={t('EnterPassword')}
              type="password"
              onIonInput={({ target: { value } }) =>
                setPassword(value as string)
              }
              value={password}
              errorPrompt={StyledInputErrorPrompt.Password}
              validate={validatePassword}
            />
            <StyledInput
              label={t('ConfirmPassword')}
              type="password"
              placeholder={t('ConfirmPassword')}
              onIonInput={({ target: { value } }) =>
                setConfirmPassword(value as string)
              }
              value={confirmPassword}
              errorPrompt={StyledInputErrorPrompt.ConfirmPassword}
              validate={validateConfirmPassword}
              submitOnEnter={confirmPasswordAndMigrateOtk}
            />
          </IonCol>
          <IonCol size="12" className={'ion-center'}>
            <IonCheckbox
              checked={checked}
              labelPlacement={'end'}
              onIonChange={() => {
                setChecked(!checked);
              }}
            >
              {t('CreatePasswordAgree')}
            </IonCheckbox>
          </IonCol>
          {alert.visible && (
            <IonCol size="12">
              <AlertBox state={alert} />
            </IonCol>
          )}
          <IonCol size="6">
            <PurpleButton
              expand="block"
              onClick={confirmPasswordAndMigrateOtk}
              disabled={!password || !confirmPassword || !checked}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          <IonCol size="6">
            <ResetPageButton
              expand="block"
              callback={() => {
                historyGoBack(history, true);
              }}
            />
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
