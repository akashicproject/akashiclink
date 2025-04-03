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
import type { LocationState } from '../../history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import {
  generateOtkAsync,
  selectError,
  selectOtk,
} from '../../slices/createWalletSlice';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/scroll-when-password-keyboard';

export function CreateWalletSecret() {
  useIosScrollPasswordKeyboardIntoView();
  const { t } = useTranslation();

  const history = useHistory<LocationState>();
  const otk = useAppSelector(selectOtk);
  const createWalletError = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  const [alert, setAlert] = useState(formAlertResetState);

  useEffect(() => {
    if (!otk) {
      dispatch(generateOtkAsync(0));
    }
  }, [otk]);

  useEffect(() => {
    setAlert(
      createWalletError
        ? errorAlertShell(t('GenericFailureMsg'))
        : formAlertResetState
    );
  }, [createWalletError, t]);

  const onConfirmSecret = () => {
    history.replace({
      pathname: akashicPayPath(urls.createWalletSecretPhraseConfirm),
    });
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid className={'ion-grid-gap-xs'}>
        <IonRow>
          <IonCol size="12">
            <IonText className={'ion-text-size-xs'} color={'dark'}>
              <h2
                className={
                  'ion-text-align-center ion-text-size-xl ion-margin-bottom-xxs ion-margin-top-0'
                }
              >
                {t('WriteSecretRecoveryPhrase')}
              </h2>
              <p className={'ion-text-align-center'}>
                {t('Store12SecretRecoveryPhrase')}
              </p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size={'12'}>
            <IonText className={'ion-text-size-xs'} color={'dark'}>
              <h3 className={'ion-text-align-left ion-margin-0'}>
                {t('Important')}
              </h3>
              <p
                className={'ion-margin-top-xxs ion-text-bold ion-text-size-xxs'}
              >
                {t('SaveBackUpSecureLocation')}
              </p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size={'12'}>
            {otk?.phrase && (
              <SecretWords
                initialWords={otk.phrase.split(' ')}
                withAction={true}
              />
            )}
          </IonCol>
        </IonRow>
        {alert?.visible && (
          <IonRow>
            <IonCol size="12">
              <AlertBox state={alert} />
            </IonCol>
          </IonRow>
        )}
        <IonRow className={'ion-justify-content-center'}>
          <IonCol size="6">
            <PurpleButton expand="block" onClick={onConfirmSecret}>
              {t('Next')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
