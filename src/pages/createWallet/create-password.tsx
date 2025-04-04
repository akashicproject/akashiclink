import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import { userConst } from '@helium-pay/backend';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { CreatePasswordForm } from '../../components/public/create-password-form';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { historyGoBack } from '../../routing/history-stack';
import { akashicPayPath } from '../../routing/navigation-tabs';
import {
  onInputChange,
  selectCreateWalletForm,
} from '../../slices/createWalletSlice';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

export const CreatePasswordInfo = styled.p({
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
});

export function CreateWalletPassword() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();

  /** Tracking user input */
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const createWalletForm = useAppSelector(selectCreateWalletForm);
  const dispatch = useAppDispatch();
  const validateConfirmPassword = (value: string) =>
    createWalletForm.password === value;

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const [alert, setAlert] = useState(formAlertResetState);

  /**
   * Validates Password, creates OTK and sends on to OTK-confirmation (Create)
   * OR, for import validates password, stores OTK and send sto Success-screen
   */
  async function confirmPasswordAndCreateOtk() {
    if (
      !(
        createWalletForm.password &&
        createWalletForm.confirmPassword &&
        createWalletForm.checked
      )
    )
      return;
    const isPasswordValid =
      validateConfirmPassword(createWalletForm.confirmPassword) &&
      validatePassword(createWalletForm.password);

    if (isPasswordValid) {
      try {
        setAlert(formAlertResetState);
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
    <CreatePasswordForm
      form={createWalletForm}
      onInputChange={onInputChange}
      onCancel={() => {
        historyGoBack(history, true);
        dispatch(
          onInputChange({
            password: '',
            confirmPassword: '',
          })
        );
      }}
      onSubmit={confirmPasswordAndCreateOtk}
      alert={alert}
    />
  );
}
