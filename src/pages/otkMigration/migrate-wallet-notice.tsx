import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import React, { useEffect } from 'react';
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

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});
export function MigrateWalletNotice() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  const nextPage = async () => {
    const otk = await generateOTK();
    lastPageStorage.store(
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
  };

  return (
    <PublicLayout contentStyle={{ padding: '24px 30px' }}>
      <MainGrid style={{ gap: '12px', padding: '0' }}>
        <IonRow>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <IonRow style={{ justifyContent: 'center' }}>
              <h1>{t('WelcomeBack')}</h1>
            </IonRow>
            <IonRow>
              <h2
                style={{
                  margin: '0 auto',
                }}
              >
                {t('UpdateNoticeImportant')}
              </h2>
            </IonRow>
            <IonRow>
              <StyledSpan style={{ textAlign: 'center' }}>
                {t('UpdateNoticeMain')}
              </StyledSpan>
            </IonRow>
            <IonRow style={{ justifyContent: 'center', marginTop: '20px' }}>
              <h3>{t('UpdateNoticeIncludes')}</h3>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow style={{ padding: '0 5px' }}>
          <IonCol>
            <IonRow style={{ textAlign: 'left', gap: '10px' }}>
              <li>{t('UpdateNoticeBullet1')}</li>
              <li>{t('UpdateNoticeBullet2')}</li>
              <li>{t('UpdateNoticeBullet3')}</li>
            </IonRow>

            <IonRow style={{ justifyContent: 'center', margin: '20px 0' }}>
              <PurpleButton
                style={{ width: '149px' }}
                expand="block"
                onClick={() => {
                  nextPage();
                }}
              >
                {t('Confirm')}
              </PurpleButton>
            </IonRow>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
