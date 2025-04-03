import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import { userConst } from '@helium-pay/backend';
import { IonCheckbox, IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import { PurpleButton } from '../../components/common/buttons';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/common/input/styled-input';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { urls } from '../../constants/urls';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  onInputChange,
  selectMigrateWalletForm,
  selectOtk,
  selectUsername,
} from '../../redux/slices/migrateWalletSlice';
import { historyResetStackAndRedirect } from '../../routing/history';
import { OwnersAPI } from '../../utils/api';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/hooks/useIosScrollPasswordKeyboardIntoView';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import type { FullOtk } from '../../utils/otk-generation';
import { signImportAuth } from '../../utils/otk-generation';

export const CreatePasswordInfo = styled.p({
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
});

export function MigrateWalletCreatePassword() {
  useIosScrollPasswordKeyboardIntoView();
  const { t } = useTranslation();
  const migrateWalletForm = useAppSelector(selectMigrateWalletForm);
  const otk = useAppSelector(selectOtk);
  const username = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  /** Tracking user input */
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const validateConfirmPassword = (value: string) =>
    migrateWalletForm.password === value;

  const [alert, setAlert] = useState(formAlertResetState);

  const { addLocalAccount, setActiveAccount, addLocalOtkAndCache } =
    useAccountStorage();

  /** Validates Password and migrates from BE-otk to FE-otk **/
  async function confirmPasswordAndMigrateOtk() {
    if (
      !(
        migrateWalletForm.password &&
        migrateWalletForm.confirmPassword &&
        migrateWalletForm.checked
      )
    )
      return;

    if (
      validateConfirmPassword(migrateWalletForm.confirmPassword) &&
      validatePassword(migrateWalletForm.password)
    ) {
      try {
        setIsLoading(true);
        // Login With v0-api to be authenticated for swap-endpoint
        await OwnersAPI.login({
          username: username!,
          password: migrateWalletForm.oldPassword!,
        });

        // Transfers permissions from server-side OTK to the just-generated client-side otk
        const { identity } = await OwnersAPI.swapEotkToOtk(
          otk!.key.pub.pkcs8pem
        );

        setAlert(formAlertResetState);

        // Set new account details and display summary screen
        const newAccount = {
          identity,
        };
        addLocalOtkAndCache(
          { ...otk, identity } as FullOtk,
          migrateWalletForm.password
        );
        addLocalAccount(newAccount);
        setActiveAccount(newAccount);

        // Login so user is authenticated
        await OwnersAPI.loginV1({
          identity,
          signedAuth: signImportAuth(otk!.key.prv.pkcs8pem, identity),
        });
        setIsLoading(false);
        historyResetStackAndRedirect(urls.migrateWalletComplete);
      } catch (e) {
        datadogRum.addError(e);
        setIsLoading(false);
        setAlert(errorAlertShell('GenericFailureMsg'));
      }
    } else setAlert(errorAlertShell('PasswordHelperText'));
  }

  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow className="ion-grid-row-gap-sm">
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
                dispatch(
                  onInputChange({
                    password: String(value),
                  })
                )
              }
              value={migrateWalletForm.password}
              errorPrompt={StyledInputErrorPrompt.Password}
              validate={validatePassword}
            />
            <StyledInput
              label={t('ConfirmPassword')}
              type="password"
              placeholder={t('ConfirmPassword')}
              onIonInput={({ target: { value } }) =>
                dispatch(
                  onInputChange({
                    confirmPassword: String(value),
                  })
                )
              }
              value={migrateWalletForm.confirmPassword}
              errorPrompt={StyledInputErrorPrompt.ConfirmPassword}
              validate={validateConfirmPassword}
              submitOnEnter={confirmPasswordAndMigrateOtk}
            />
          </IonCol>
          <IonCol size="12" className={'ion-center'}>
            <IonCheckbox
              checked={migrateWalletForm.checked}
              labelPlacement={'end'}
              onIonChange={() => {
                dispatch(
                  onInputChange({
                    checked: !migrateWalletForm.checked,
                  })
                );
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
          <IonCol className={'ion-center ion-margin-top-xl'}>
            <PurpleButton
              style={{ width: '149px' }}
              expand="block"
              onClick={confirmPasswordAndMigrateOtk}
              disabled={
                !migrateWalletForm.password ||
                !migrateWalletForm.confirmPassword ||
                !migrateWalletForm.checked
              }
              isLoading={isLoading}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
