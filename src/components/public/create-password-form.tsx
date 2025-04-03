import { userConst } from '@helium-pay/backend';
import { IonCheckbox, IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { AlertBox, FormAlertState } from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/scroll-when-password-keyboard';
import { useAppDispatch } from '../../app/hooks';
import { CreateWalletForm } from '../../slices/createWalletSlice';

export function CreatePasswordForm({
  form,
  onInputChange,
  onCancel,
  onSubmit,
  alert,
  isLoading = false,
}: {
  form: CreateWalletForm;
  onInputChange: Function;
  onCancel: () => void;
  onSubmit: () => void;
  alert?: FormAlertState;
  isLoading?: boolean;
}) {
  useIosScrollPasswordKeyboardIntoView();
  const { t } = useTranslation();

  /** Tracking user input */
  const validatePassword = (value: string) =>
    !!value.match(userConst.passwordRegex);
  const dispatch = useAppDispatch();
  const validateConfirmPassword = (value: string) => form.password === value;

  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow className="ion-grid-row-gap-lg">
          <IonCol size="12">
            <h2 className={'ion-margin-bottom-xxs'}>{t('CreatePassword')}</h2>
            <p
              className={'ion-margin-0 ion-text-align-center ion-text-size-xs'}
            >
              {t('CreatePasswordInfo')}
            </p>
          </IonCol>
          <IonRow className="ion-grid-row-gap-xs">
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
                value={form.password}
                errorPrompt={StyledInputErrorPrompt.Password}
                validate={validatePassword}
              />
            </IonCol>
            <IonCol size="12">
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
                value={form.confirmPassword}
                errorPrompt={StyledInputErrorPrompt.ConfirmPassword}
                validate={validateConfirmPassword}
                submitOnEnter={onSubmit}
              />
            </IonCol>
          </IonRow>
          <IonCol size="12" className={'ion-center'}>
            <IonCheckbox
              checked={form.checked}
              labelPlacement={'end'}
              onIonChange={() => {
                dispatch(
                  onInputChange({
                    checked: !form.checked,
                  })
                );
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
              disabled={
                !form.password || !form.confirmPassword || !form.checked
              }
              isLoading={isLoading}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          <IonCol size="6">
            <WhiteButton
              disabled={isLoading}
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
