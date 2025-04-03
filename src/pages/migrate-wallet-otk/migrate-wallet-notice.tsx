import { IonCol, IonRow, IonText } from '@ionic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton } from '../../components/common/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { urls } from '../../constants/urls';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { onClear } from '../../redux/slices/importWalletSlice';
import {
  onInputChange,
  selectMigrateWalletForm,
  setUsername,
} from '../../redux/slices/migrateWalletSlice';
import type { LocationState } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useIosScrollPasswordKeyboardIntoView } from '../../utils/hooks/useIosScrollPasswordKeyboardIntoView';

export function MigrateWalletNotice() {
  useIosScrollPasswordKeyboardIntoView();
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const migrateWalletForm = useAppSelector(selectMigrateWalletForm);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (history.location.state?.migrateWallet?.username) {
      dispatch(setUsername(history.location.state.migrateWallet.username));
    }
    if (history.location.state?.migrateWallet?.oldPassword) {
      dispatch(
        onInputChange({
          oldPassword: history.location.state.migrateWallet?.oldPassword,
        })
      );
    }
  }, [history.location.state]);

  const nextPage = async () => {
    // Because we might have been pushed to migration from import-flow, clear the import-state here
    dispatch(onClear());
    // If no password provided, send to page to get old password (used to login and decrypt old eOtk for migration)
    if (!migrateWalletForm.oldPassword) {
      history.replace(akashicPayPath(urls.migrateWalletOldPassword));
    } else {
      history.replace(akashicPayPath(urls.migrateWalletSecret));
    }
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid style={{ gap: '12px', padding: '0' }}>
        <IonRow className={'ion-text-align-center ion-center'}>
          <IonCol size="12">
            <h1 className={'ion-text-size-xxl ion-margin-0'}>
              {t('WelcomeBack')}
            </h1>
            <h2 className={'ion-text-size-xl ion-margin-0'}>
              {t('UpdateNoticeImportant')}
            </h2>
          </IonCol>
          <IonCol size="12">
            <IonText
              className={'ion-text-align-center ion-text-size-xs'}
              color={'dark'}
            >
              <p>{t('UpdateNoticeMain')}</p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow className={'ion-center'} style={{ padding: '0 4px' }}>
          <IonCol
            size="12"
            className={'ion-padding-horizontal ion-text-align-left'}
          >
            <h3>{t('UpdateNoticeIncludes')}</h3>
            <IonText className={'ion-text-size-xs'} color={'dark'}>
              <ul>
                <li>{t('UpdateNoticeBullet1')}</li>
                <li>{t('UpdateNoticeBullet2')}</li>
                <li>{t('UpdateNoticeBullet3')}</li>
              </ul>
            </IonText>
          </IonCol>
          <IonCol className={'ion-center ion-margin-top-xl'}>
            <PurpleButton
              style={{ width: '149px' }}
              expand="block"
              onClick={() => {
                nextPage();
              }}
            >
              {t('Confirm')}
            </PurpleButton>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
