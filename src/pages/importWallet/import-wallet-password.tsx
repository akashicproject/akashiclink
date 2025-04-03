import styled from '@emotion/styled';
import { userConst } from '@helium-pay/backend';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CreatePasswordForm } from '../../components/public/create-password-form';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { historyGoBack } from '../../routing/history-stack';
import { akashicPayPath } from '../../routing/navigation-tabs';
import {
  onInputChange,
  selectImportWalletForm,
  selectOtk,
} from '../../slices/importWalletSlice';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useOwner } from '../../utils/hooks/useOwner';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

export const CreatePasswordInfo = styled.p({
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
});

export function ImportWalletPassword() {
  const history = useHistory<LocationState>();

  /** Tracking user input */
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const { addLocalOtkAndCache, addLocalAccount, setActiveAccount } =
    useAccountStorage();
  const importWalletForm = useAppSelector(selectImportWalletForm);
  const otk = useAppSelector(selectOtk);
  const dispatch = useAppDispatch();
  const validateConfirmPassword = (value: string) =>
    importWalletForm.password === value;
  const { mutateOwner } = useOwner();

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  /**
   * Validates Password, creates OTK and sends on to OTK-confirmation (Create)
   * OR, for import validates password, stores OTK and send sto Success-screen
   */
  async function confirmPasswordAndCreateOtk() {
    if (
      !(
        importWalletForm.password &&
        importWalletForm.confirmPassword &&
        importWalletForm.checked
      )
    )
      return;
    const isPasswordValid =
      validateConfirmPassword(importWalletForm.confirmPassword) &&
      validatePassword(importWalletForm.password);

    if (isPasswordValid && otk && otk.identity) {
      // call import api and store the Identity.
      // added local otk
      addLocalOtkAndCache(otk, importWalletForm.password);
      // need to add local account
      addLocalAccount({
        identity: otk.identity,
      });
      setActiveAccount({
        identity: otk.identity,
      });

      await mutateOwner();

      history.push({
        pathname: akashicPayPath(urls.importSuccess),
      });
    }
  }

  return (
    <CreatePasswordForm
      form={importWalletForm}
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
    />
  );
}
