import { IonCol, IonRow, IonText } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/common/buttons';
import { StyledInput } from '../../components/common/input/styled-input';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { urls } from '../../constants/urls';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  onClear,
  onInputChange,
  restoreOtkFromKeypairAsync,
  selectError,
  selectImportWalletForm,
} from '../../redux/slices/importWalletSlice';
import { historyGoBackOrReplace } from '../../routing/history';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function ImportWalletKeypair() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const importWalletForm = useAppSelector(selectImportWalletForm);
  const importWalletError = useAppSelector(selectError);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(formAlertResetState);

  useEffect(() => {
    setAlert(
      importWalletError
        ? errorAlertShell(unpackRequestErrorMessage(importWalletError))
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
              dispatch(onClear());
              dispatch(
                onInputChange({
                  privateKey: String(value).replace(/[^a-zA-Z\d]+/g, ''), // Filter out non-alphanumeric
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
