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
import { useOwner } from '../../utils/hooks/useOwner';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../../utils/last-page-storage';
import { generateOTK } from '../../utils/otk-generation';
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

export function CreateWalletPassword() {
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

  /**
   * Countdown showing validity of activation code
   */

  useEffect(() => {
    cacheCurrentPage(
      urls.createWalletPassword,
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

  useEffect(() => {
    if (password || confirmPassword) {
      lastPageStorage.store(
        urls.createWalletPassword,
        NavigationPriority.IMMEDIATE,
        {
          password: password,
          confirmPassword: confirmPassword,
        }
      );
    }
  }, [password, confirmPassword]);
  /**
   * Validates Password, creates OTK and sends on to OTK-confirmation
   */
  async function confirmPasswordAndCreateOtk() {
    if (!(password && confirmPassword && checked)) return;

    if (
      validateConfirmPassword(confirmPassword) &&
      validatePassword(password)
    ) {
      try {
        // Generate OTK
        const otk = await generateOTK();

        await lastPageStorage.clear();

        setAlert(formAlertResetState);
        await lastPageStorage.clear();

        // Navigate to pages to see and confirm the 12-words from the otk
        // TODO: Edit secret-confirm page to trigger backend-interaction, loading screen and storing the otk (with the identity fetched from backend)
        lastPageStorage.store(urls.secret, NavigationPriority.IMMEDIATE, {
          passPhrase: otk.phrase,
        });
        history.push({
          pathname: akashicPayPath(urls.secret),
          state: { createWallet: { password, otk } },
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
                submitOnEnter={confirmPasswordAndCreateOtk}
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
                onClick={confirmPasswordAndCreateOtk}
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
