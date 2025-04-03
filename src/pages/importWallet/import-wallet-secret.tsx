import styled from '@emotion/styled';
import { IonCol, IonIcon, IonRow, IonText } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { SecretWords } from '../../components/secret-words/secret-words';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import {
  onClear,
  onInputChange,
  reconstructOtkAsync,
  selectError,
  selectImportWalletForm,
} from '../../slices/importWalletSlice';
import { validateSecretPhrase } from '../../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

const StyledSpan = styled.span({
  fontSize: '12px',
  textAlign: 'center',
  color: 'var(--ion-color-primary-10)',
});
const StyledDiv = styled.div`
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 2px solid #c297ff;
  border-radius: 8px;
  width: 100%;
  text-align: center;
`;
export const ImportWalletSecret = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const importWalletForm = useAppSelector(selectImportWalletForm);
  const importWalletError = useAppSelector(selectError);

  const [alert, setAlert] = useState(formAlertResetState);
  const [isLoading, setIsLoading] = useState(false);

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const isAllFilled = importWalletForm.passPhrase?.every(
    (phrase) => phrase !== ''
  );

  useEffect(() => {
    setAlert(
      importWalletError
        ? errorAlertShell(t(unpackRequestErrorMessage(importWalletError)))
        : formAlertResetState
    );
  }, [importWalletError, t]);

  const onConfirmRecoveryPhrase = async () => {
    setIsLoading(true);

    if (
      !isAllFilled ||
      typeof importWalletForm.passPhrase === 'undefined' ||
      !validateSecretPhrase(importWalletForm.passPhrase)
    ) {
      setAlert(errorAlertShell(t('InvalidSecretPhrase')));
      return;
    }

    try {
      dispatch(reconstructOtkAsync(importWalletForm.passPhrase));
    } catch (e) {
      setAlert(
        errorAlertShell(
          importWalletError?.message ||
            (e as Error).message ||
            t('GenericFailureMsg')
        )
      );
    }

    setIsLoading(false);
  };

  const onSecretWordsChange = async (values: string[]) => {
    setAlert(formAlertResetState);
    dispatch(
      onInputChange({
        passPhrase: values,
      })
    );
  };

  const onCancel = () => {
    dispatch(onClear());
    history.length > 1
      ? history.goBack()
      : history.replace(akashicPayPath(urls.importWalletSelectMethod));
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid className={'ion-grid-row-gap-md'}>
        <IonRow>
          <IonCol size="12">
            <h2>{t('AccessWalletWithRecoveryPhrase')}</h2>
            <StyledSpan>
              {t('AkashicWalletCannotRecoverYourPassword')}{' '}
              <a
                href="https://akashic-1.gitbook.io/akashicwallet/"
                target={'_blank'}
                style={{
                  textDecoration: 'none',
                  color: 'var(--ion-color-primary-10)',
                }}
                rel="noreferrer"
              >
                {t('LearnMore')}
              </a>
            </StyledSpan>
          </IonCol>
        </IonRow>
        <IonRow style={{ justifyContent: 'center' }}>
          <StyledSpan style={{ fontWeight: '700' }}>
            {t('TypeSecretPhrase')}
          </StyledSpan>
        </IonRow>
        <IonRow>
          <SecretWords
            inputVisibility={true}
            initialWords={importWalletForm.passPhrase ?? new Array(12).fill('')}
            disableInput={false}
            onChange={onSecretWordsChange}
          />
        </IonRow>
        <IonRow>
          <IonCol size="12">
            <StyledDiv color="var(--ion-color-primary-10)">
              <IonIcon
                src="shared-assets/images/alert.svg"
                style={{ fontSize: '14px' }}
              />
              <IonText>
                <h5 className="ion-no-margin ion-text-size-xxs">
                  {t('PasteYourSecretPhrase')}
                </h5>
              </IonText>
            </StyledDiv>
          </IonCol>
        </IonRow>
        {alert.visible && (
          <IonRow>
            <IonCol size="12">
              <StyledDiv
                style={{
                  justifyContent: 'center',
                  border: '1px solid #DE3730',
                  display: 'flex',
                  color: 'var(--ion-color-danger)',
                }}
              >
                {t(alert.message)}
              </StyledDiv>
            </IonCol>
          </IonRow>
        )}
        <IonRow>
          <IonCol size="6">
            <PurpleButton
              expand="block"
              disabled={!isAllFilled || alert.visible}
              onClick={onConfirmRecoveryPhrase}
              isLoading={isLoading}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          <IonCol size="6">
            <WhiteButton expand="block" onClick={onCancel}>
              {t('Cancel')}
            </WhiteButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
