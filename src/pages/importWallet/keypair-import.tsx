import { IonCol, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
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
import { historyGoBack } from '../../routing/history-stack';
import {
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

  /**
   * Track state of page
   */

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

  async function requestImport() {
    if (importWalletForm.privateKey) {
      dispatch(restoreOtkFromKeypairAsync(importWalletForm.privateKey));
    }
  }

  const CancelButton = (
    <IonCol>
      <WhiteButton
        expand="block"
        fill="clear"
        onClick={() => {
          historyGoBack(history, true);
        }}
      >
        {t('Cancel')}
      </WhiteButton>
    </IonCol>
  );

  return (
    <PublicLayout className="vertical-center">
      <IonRow>
        <IonCol>
          <h2>{t('ImportWallet')}</h2>
        </IonCol>
      </IonRow>

      <>
        <IonRow>
          <IonCol>
            <h6>{t('EnterKeyPair')}</h6>
          </IonCol>
        </IonRow>
        <IonRow style={{ marginTop: '40px' }}>
          <IonCol>
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
        </IonRow>
        <IonRow>
          <IonCol>
            <PurpleButton
              disabled={!importWalletForm.privateKey}
              onClick={requestImport}
              expand="block"
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          {CancelButton}
        </IonRow>
        <IonRow style={{ marginTop: '24px' }}>
          <AlertBox state={alert} />
        </IonRow>
      </>
    </PublicLayout>
  );
}
