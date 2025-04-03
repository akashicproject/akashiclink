import styled from '@emotion/styled';
import { IonCol, IonRow, IonText } from '@ionic/react';
import { isEqual } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/common/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { SecretWords } from '../../components/wallet-setup/secret-words';
import { urls } from '../../constants/urls';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  onInputChange,
  selectMaskedPassPhrase,
  selectMigrateWalletForm,
  selectOtk,
} from '../../redux/slices/migrateWalletSlice';
import { akashicPayPath } from '../../routing/navigation-tabs';

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

  const confirmSecret = () => {
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
      history.replace({
        pathname: akashicPayPath(urls.migrateWalletPassword),
      });
    } catch (e) {
      const error = e as Error;
      const message = error.message || t('GenericFailureMsg');
      setAlert(errorAlertShell(message));
    }
  };

  const onCancel = () => {
    history.replace({
      pathname: akashicPayPath(urls.migrateWalletSecret),
    });
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid style={{ gap: '24px', padding: '0' }}>
        <IonRow>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <h2>{t('ConfirmSecretRecovery')}</h2>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonRow style={{ textAlign: 'left' }}>
              <IonCol size={'12'}>
                <IonText className={'ion-text-size-xs'} color={'dark'}>
                  <h3 className={'ion-text-align-left ion-margin-0'}>
                    {t('Important')}
                  </h3>
                  <p
                    className={
                      'ion-margin-top-xxs ion-text-bold ion-text-size-xxs'
                    }
                  >
                    {t('SaveBackUpSecureLocation')}
                  </p>
                </IonText>
              </IonCol>
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
          <IonCol size="6">
            <PurpleButton expand="block" onClick={confirmSecret}>
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
          <IonCol size="6">
            <WhiteButton expand="block" fill="clear" onClick={onCancel}>
              {t('GoBack')}
            </WhiteButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
