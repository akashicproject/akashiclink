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
import { useOwner } from '../../utils/hooks/useOwner';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../../utils/last-page-storage';
import type { FullOtk } from '../../utils/otk-generation';
import { signImportAuth } from '../../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

export const CreatePasswordInfo = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});

const CheckBoxText = styled.span({
  fontSize: '12px',
  fontWeight: '700',
  fontFamily: 'Nunito Sans',
  color: 'var(--ion-color-primary-10)',
});

export function MigrateWalletCreatePassword() {
  const { t } = useTranslation();
  const history = useHistory();
  const loginCheck = useOwner(true);

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

        history.push({
          pathname: akashicPayPath(urls.migrateWalletComplete),
        });
      } catch (e) {
        datadogRum.addError(e);
        setAlert(errorAlertShell(t('GenericFailureMsg')));
      }
    } else setAlert(errorAlertShell(t('PasswordHelperText')));
  }

  /**
   * Redirect user to previous page, and reset page state
   */
  const CancelButton = (
    <IonCol>
      <ResetPageButton
        expand="block"
        callback={() => {
          historyGoBack(
            history,
            !loginCheck.isLoading && !loginCheck.authenticated
          );
        }}
      />
    </IonCol>
  );
  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow>
          <IonCol>
            <h2>{t('CreatePassword')}</h2>
            <IonRow>
              <CreatePasswordInfo style={{ textAlign: 'center' }}>
                {t('CreatePasswordInfo')}
              </CreatePasswordInfo>
            </IonRow>
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
                validate={validatePassword}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
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
          </IonRow>
          <IonRow>
            <IonCol
              size="12"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IonCheckbox
                style={{ marginRight: '8px' }}
                onIonChange={() => {
                  setChecked(!checked);
                }}
              />
              <CheckBoxText>{t('CreatePasswordAgree')}</CheckBoxText>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <PurpleButton
                expand="block"
                onClick={confirmPasswordAndMigrateOtk}
                disabled={!password || !confirmPassword || !checked}
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
