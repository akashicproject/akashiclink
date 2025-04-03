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
import type { LocationState } from '../../history';
import { historyGoBack } from '../../routing/history-stack';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
  ResetPageButton,
} from '../../utils/last-page-storage';
import type { FullOtk } from '../../utils/otk-generation';
import { generateOTK } from '../../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

export const CreatePasswordInfo = styled.p({
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
});

export function CreateWalletPassword() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();

  /** Tracking user input */
  const [password, setPassword] = useState<string>();
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [otk, setOtk] = useState<FullOtk>();
  const { addLocalOtkAndCache, addLocalAccount } = useAccountStorage();
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
        await lastPageStorage.clear();
        if (data.password) {
          setPassword(data.password);
          setConfirmPassword(data.confirmPassword);
        }
        if (data.otk) {
          setOtk(data.otk);
        }
        await lastPageStorage.store(
          urls.createWalletPassword,
          NavigationPriority.IMMEDIATE,
          {
            password: data.password,
            confirmPassword: data.confirmPassword,
            otk: otk || null,
          }
        );
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
          otk: otk || null,
        }
      );
    }
  }, [password, confirmPassword]);
  /**
   * Validates Password, creates OTK and sends on to OTK-confirmation (Create)
   * OR, for import validates password, stores OTK and send sto Success-screen
   */
  async function confirmPasswordAndCreateOtk() {
    if (!(password && confirmPassword && checked)) return;
    const isPasswordValid =
      validateConfirmPassword(confirmPassword) && validatePassword(password);

    if (
      isPasswordValid &&
      history.location?.state?.createPassword?.isImport &&
      otk &&
      otk.identity
    ) {
      // call import api and store the Identity.
      // added local otk
      addLocalOtkAndCache(otk, password);
      // need to add local account
      addLocalAccount({
        identity: otk.identity,
      });

      // remove local variables
      await lastPageStorage.clear();
      setConfirmPassword(undefined);
      setPassword(undefined);

      history.push({
        pathname: akashicPayPath(urls.importSuccess),
      });
    } else if (isPasswordValid) {
      try {
        // Generate OTK
        const otk = await generateOTK();

        setAlert(formAlertResetState);
        await lastPageStorage.clear();

        // Navigate to pages to see and confirm the 12-words from the otk
        lastPageStorage.store(urls.secret, NavigationPriority.IMMEDIATE, {
          passPhrase: otk.phrase,
          password,
          otk,
        });

        setConfirmPassword(undefined);
        setPassword(undefined);

        history.push({
          pathname: akashicPayPath(urls.secret),
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
              submitOnEnter={confirmPasswordAndCreateOtk}
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
              onClick={confirmPasswordAndCreateOtk}
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
