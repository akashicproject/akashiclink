import styled from '@emotion/styled';
import { userConst } from '@helium-pay/backend';
import { IonCheckbox, IonCol, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertBox,
  FormAlertState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';
import { useAppDispatch } from "../../app/hooks"
import { CreateWalletForm } from '../../slices/createWalletSlice';

export const CreatePasswordInfo = styled.p({
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
});

export function CreatePasswordForm({
  form,
  onInputChange,
  onCancel,
  onSubmit,
  alert
}: {
  form: CreateWalletForm
  onInputChange: Function
  onCancel: () => void
  onSubmit: () => void
  alert?: FormAlertState
}) {
  const { t } = useTranslation();

  /** Tracking user input */
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const dispatch = useAppDispatch()
  const validateConfirmPassword = (value: string) => form.password === value;

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

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
                  dispatch(onInputChange({
                    password: String(value)
                  }))
                }
                value={form.password}
                errorPrompt={StyledInputErrorPrompt.Password}
                validate={validatePassword}
              />
              <StyledInput
                label={t('ConfirmPassword')}
                type="password"
                placeholder={t('ConfirmPassword')}
                onIonInput={({ target: { value } }) =>
                  dispatch(onInputChange({
                    confirmPassword: String(value)
                  }))
                }
                value={form.confirmPassword}
                errorPrompt={StyledInputErrorPrompt.ConfirmPassword}
                validate={validateConfirmPassword}
                submitOnEnter={onSubmit}
              />
            </IonCol>
            <IonCol size="12" className={'ion-center'}>
              <IonCheckbox
                checked={form.checked}
                labelPlacement={'end'}
                onIonChange={() => {
                  dispatch(onInputChange({
                    checked: !form.checked
                  }))
                }}
              >
                {t('CreatePasswordAgree')}
              </IonCheckbox>
            </IonCol>
            {alert?.visible && (
              <IonCol size="12">
                <AlertBox state={alert} />
              </IonCol>
            )}
            <IonCol size="6">
              <PurpleButton
                expand="block"
                onClick={onSubmit}
                disabled={!form.password || !form.confirmPassword || !form.checked}
              >
                {t('Confirm')}
              </PurpleButton>
            </IonCol>
            <IonCol size="6">
              <WhiteButton
                expand="block"
                fill="clear"
                onClick={onCancel}
              >
                {t('Cancel')}
              </WhiteButton>
            </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
