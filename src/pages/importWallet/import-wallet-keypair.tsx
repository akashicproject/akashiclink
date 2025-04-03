import { IonCol, IonRow, IonText } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { PublicLayout } from '../../components/layout/public-layout';
import { StyledInput } from '../../components/styled-input';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { historyGoBackOrReplace } from '../../history';
import {
  onClear,
  onInputChange,
  restoreOtkFromKeypairAsync,
  selectError,
  selectImportWalletForm,
} from '../../slices/importWalletSlice';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function ImportWalletKeypair() {
  const history = useHistory<LocationState>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const importWalletForm = useAppSelector(selectImportWalletForm);
  const importWalletError = useAppSelector(selectError);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(formAlertResetState);

  useEffect(() => {
    setAlert(
      importWalletError
        ? errorAlertShell(t(unpackRequestErrorMessage(importWalletError)))
        : formAlertResetState
    );
  }, [importWalletError, t]);

  const onRequestImport = async () => {
    if (importWalletForm.privateKey) {
      setIsLoading(true);
      dispatch(restoreOtkFromKeypairAsync(importWalletForm.privateKey));
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    dispatch(onClear());
    historyGoBackOrReplace(urls.importWalletSelectMethod);
  };

  return (
    <PublicLayout className="vertical-center">
      <IonRow className={'ion-grid-row-gap-md'}>
        <IonCol size="12" className={'ion-text-align-center'}>
          <h2 className={'ion-margin-bottom-xxs'}>{t('ImportWallet')}</h2>
          <IonText
            className={
              'ion-text-align-center ion-text-size-xs ion-margin-bottom-lg'
            }
            color={'dark'}
          >
            {t('EnterKeyPair')}
          </IonText>
        </IonCol>
        <IonCol size="12">
          <StyledInput
            label={t('KeyPair')}
            type={'text'}
            value={importWalletForm.privateKey}
            placeholder={t('EnterKeyPair')}
            onIonInput={({ target: { value } }) => {
              dispatch(
                onInputChange({
                  privateKey: String(value),
                })
              );
              setAlert(formAlertResetState);
            }}
            submitOnEnter={onRequestImport}
          />
        </IonCol>
        {alert.visible && (
          <IonCol size="12">
            <AlertBox state={alert} />
          </IonCol>
        )}
        <IonCol size="6">
          <PurpleButton
            disabled={!!importWalletError || !importWalletForm.privateKey}
            onClick={onRequestImport}
            expand="block"
            isLoading={isLoading}
          >
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
        <IonCol size="6">
          <WhiteButton expand="block" fill="clear" onClick={onCancel}>
            {t('Cancel')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </PublicLayout>
  );
}
