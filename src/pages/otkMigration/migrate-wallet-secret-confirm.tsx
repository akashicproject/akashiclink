import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import { isEqual } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  AlertBox,
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
  onInputChange,
  selectMaskedPassPhrase,
  selectMigrateWalletForm,
  selectOtk,
} from '../../slices/migrateWalletSlice';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});

export function MigrateWalletSecretConfirm() {
  const { t } = useTranslation();
  const history = useHistory();
  const migrateWalletForm = useAppSelector(selectMigrateWalletForm);
  const otk = useAppSelector(selectOtk);
  const maskedPassPhrase = useAppSelector(selectMaskedPassPhrase);
  const dispatch = useAppDispatch();
  const [alert, setAlert] = useState(formAlertResetState);

  const confirmSecret = async () => {
    try {
      // Check for correct 12-word confirmation
      if (
        !isEqual(
          migrateWalletForm.confirmPassPhrase!.join(' '),
          otk!.phrase!.trim()
        )
      ) {
        throw new Error(t('InvalidSecretPhrase'));
      }

      setAlert(formAlertResetState);
      history.push({
        pathname: akashicPayPath(urls.migrateWalletPassword),
      });
    } catch (e) {
      const error = e as Error;
      const message = error.message || t('GenericFailureMsg');
      setAlert(errorAlertShell(message));
    }
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid style={{ gap: '24px', padding: '0' }}>
        <IonRow>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <IonRow>
              <h2
                style={{
                  margin: '0 56px',
                }}
              >
                {t('ConfirmSecretRecovery')}
              </h2>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonRow style={{ textAlign: 'left' }}>
              <h3 style={{ margin: '0' }}>{t('Important')}</h3>
              <StyledSpan style={{ textAlign: 'justify' }}>
                {t('SaveBackUpSecureLocation')}
              </StyledSpan>
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
              <SecretWords
                initialWords={maskedPassPhrase}
                withAction={false}
                onChange={(value) => {
                  dispatch(
                    onInputChange({
                      confirmPassPhrase: value,
                    })
                  );
                }}
              />
            </IonRow>
          </IonCol>
        </IonRow>
        {alert.visible && (
          <IonRow>
            <AlertBox state={alert} />
          </IonRow>
        )}
        <IonRow style={{ justifyContent: 'space-around' }}>
          <IonCol size="5">
            <PurpleButton
              style={{ width: '100%' }}
              expand="block"
              onClick={() => confirmSecret()}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          <IonCol size="5">
            <WhiteButton
              style={{ width: '100%' }}
              fill="clear"
              onClick={async () => {
                history.push({
                  pathname: akashicPayPath(urls.migrateWalletSecret),
                });
              }}
            >
              {t('GoBack')}
            </WhiteButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
