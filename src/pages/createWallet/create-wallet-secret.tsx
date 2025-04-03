import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import React, { useEffect, useState } from 'react';
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
import type { LocationState } from '../../history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import {
  generateOtkAsync,
  selectError,
  selectOtk,
} from '../../slices/createWalletSlice';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});
export function CreateWalletSecret() {
  const { t } = useTranslation();

  const history = useHistory<LocationState>();
  const otk = useAppSelector(selectOtk);
  const dispatch = useAppDispatch();

  const [alert, setAlert] = useState(formAlertResetState);
  const createWalletError = useAppSelector(selectError);

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  useEffect(() => {
    if (!otk) {
      dispatch(generateOtkAsync(0));
    }
  }, [otk]);

  useEffect(() => {
    if (createWalletError) {
      setAlert(errorAlertShell(t('GenericFailureMsg')));
    } else {
      setAlert(formAlertResetState);
    }
  }, [createWalletError]);

  const confirmSecret = async () => {
    history.push({
      pathname: akashicPayPath(urls.secretConfirm),
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
              <h3 style={{ margin: '0' }}>{t('Important')}</h3>
              <StyledSpan style={{ textAlign: 'justify' }}>
                {t('SaveBackUpSecureLocation')}
              </StyledSpan>
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
              {otk?.phrase && (
                <SecretWords
                  initialWords={otk.phrase.split(' ')}
                  withAction={true}
                />
              )}
            </IonRow>
            <IonRow style={{ justifyContent: 'center' }}>
              <PurpleButton
                style={{ width: '149px' }}
                expand="block"
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
