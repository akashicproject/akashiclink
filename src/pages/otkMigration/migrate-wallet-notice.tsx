import { IonCol, IonRow, IonText } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import {
  lastPageStorage,
  NavigationPriority,
} from '../../utils/last-page-storage';
import { generateOTK } from '../../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

export function MigrateWalletNotice() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const nextPage = async () => {
    const otk = await generateOTK();
    // If no password provided, send to page to get old password (used to login and decrypt old eOtk for migration)
    if (!history.location.state.migrateWallet?.oldPassword) {
      await lastPageStorage.store(
        urls.migrateWalletOldPassword,
        NavigationPriority.IMMEDIATE,
        {
          username: history.location.state.migrateWallet?.username,
          passPhrase: otk.phrase,
          otk,
        }
      );
      history.push(urls.migrateWalletOldPassword);
    } else {
      await lastPageStorage.store(
        urls.migrateWalletSecret,
        NavigationPriority.IMMEDIATE,
        {
          username: history.location.state.migrateWallet?.username,
          oldPassword: history.location.state.migrateWallet?.oldPassword,
          passPhrase: otk.phrase,
          otk,
        }
      );
      history.push(urls.migrateWalletSecret);
    }
  };

  return (
    <PublicLayout contentStyle={{ padding: '24px 30px' }}>
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
