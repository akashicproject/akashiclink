import { IonCol, IonIcon, IonRow, IonSpinner, IonText } from '@ionic/react';
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
import type { LocationState } from '../../history';
import {
  onClear,
  onInputChange,
  restoreOtkFromKeypairAsync,
  selectError,
  selectImportWalletForm,
} from '../../slices/importWalletSlice';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

export function KeyPairImport() {
  const history = useHistory<LocationState>();
  const { t } = useTranslation();
  const importWalletForm = useAppSelector(selectImportWalletForm);
  const dispatch = useAppDispatch();
  const importWalletError = useAppSelector(selectError);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(formAlertResetState);

  useEffect(() => {
    if (importWalletError) {
      setAlert(
        errorAlertShell(t(unpackRequestErrorMessage(importWalletError)))
      );
    } else {
      setAlert(formAlertResetState);
    }
  }, [importWalletError]);

  const requestImport = async () => {
    if (importWalletForm.privateKey) {
      setIsLoading(true);
      dispatch(restoreOtkFromKeypairAsync(importWalletForm.privateKey));
      setIsLoading(false);
    }
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
            submitOnEnter={requestImport}
          />
        </IonCol>
        {alert.visible && (
          <IonCol size="12">
            <AlertBox state={alert} />
          </IonCol>
        )}
        <IonCol size="6">
          <PurpleButton
            disabled={!importWalletForm.privateKey}
            onClick={requestImport}
            expand="block"
            isLoading={isLoading}
          >
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
        <IonCol size="6">
          <WhiteButton
            expand="block"
            fill="clear"
            onClick={() => {
              history.goBack();
              dispatch(onClear());
            }}
          >
            {t('Cancel')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </PublicLayout>
  );
}
