import styled from '@emotion/styled';
import { IonCol, IonRow, IonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { SecretWords } from '../../components/secret-words/secret-words';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import {
  generateOtkAsync,
  selectError,
  selectOtk,
} from '../../slices/migrateWalletSlice';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/scroll-when-password-keyboard';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});
export function MigrateWalletSecret() {
  useIosScrollPasswordKeyboardIntoView();
  const { t } = useTranslation();
  const history = useHistory();
  const otk = useAppSelector(selectOtk);
  const dispatch = useAppDispatch();
  const [isDisable, setIsDisable] = useState(true);
  const [alert, setAlert] = useState(formAlertResetState);
  const migrateWalletError = useAppSelector(selectError);

  useEffect(() => {
    if (!otk) {
      dispatch(generateOtkAsync(0));
    }
  }, [otk]);

  useEffect(() => {
    setAlert(
      migrateWalletError
        ? errorAlertShell(t('GenericFailureMsg'))
        : formAlertResetState
    );
  }, [migrateWalletError]);

  const confirmSecret = async () => {
    history.replace({
      pathname: akashicPayPath(urls.migrateWalletSecretConfirm),
    });
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid style={{ gap: '24px', padding: '0' }}>
        <IonRow>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <IonRow>
              <h2
                style={{
                  fontSize: '20pt',
                  margin: '0 auto',
                }}
              >
                {t('WriteSecretRecoveryPhrase')}
              </h2>
            </IonRow>
            <IonRow>
              <StyledSpan style={{ textAlign: 'center' }}>
                {t('Store12SecretRecoveryPhrase')}
              </StyledSpan>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonRow style={{ textAlign: 'left' }}>
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
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
              <IonCol size="12" className="ion-no-margin">
                {otk?.phrase && (
                  <SecretWords
                    initialWords={otk.phrase.split(' ')}
                    withAction={true}
                    onHiddenChange={(isSecretPhraseHidden) => {
                      setIsDisable(isSecretPhraseHidden);
                    }}
                  />
                )}
              </IonCol>
            </IonRow>
            <IonRow style={{ justifyContent: 'center' }}>
              <PurpleButton
                style={{ width: '149px' }}
                expand="block"
                disabled={isDisable}
                onClick={() => {
                  confirmSecret();
                }}
              >
                {t('Next')}
              </PurpleButton>
            </IonRow>
          </IonCol>
          {alert?.visible && (
            <IonCol size="12">
              <AlertBox state={alert} />
            </IonCol>
          )}
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
