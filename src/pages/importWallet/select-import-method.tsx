import styled from '@emotion/styled';
import { IonCol, IonIcon, IonRow } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  PurpleButton,
  SquareWhiteButton,
  WhiteButton,
} from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { useTheme } from '../../components/PreferenceProvider';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { themeType } from '../../theme/const';
import { lastPageStorage } from '../../utils/last-page-storage';
import { importAccountUrl } from '../import-wallet';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});

export const SelectImportMethod = () => {
  const [storedTheme] = useTheme();
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <PublicLayout contentStyle={{ padding: '0 30px' }}>
      <SquareWhiteButton
        className="icon-button"
        style={{ position: 'fixed', left: '24px', marginTop: '16px' }}
        onClick={async () => {
          await lastPageStorage.clear();
          history.push(akashicPayPath(urls.akashicPay));
        }}
      >
        <IonIcon
          class="icon-button-icon"
          slot="icon-only"
          src={`/shared-assets/images/${
            storedTheme === themeType.DARK
              ? 'back-arrow-white.svg'
              : 'back-arrow-purple.svg'
          }`}
        />
      </SquareWhiteButton>
      <MainGrid style={{ gap: '16px', padding: '142px 15px' }}>
        <IonRow>
          <IonCol>
            <h2 style={{ marginBottom: '8px' }}>{t('ImportWallet')}</h2>
            <StyledSpan style={{ textAlign: 'center' }}>
              {t('PleaseChooseSecurityOptionToImportWallet')}
            </StyledSpan>
          </IonCol>
        </IonRow>
        <IonRow>
          <PurpleButton
            style={{ width: '100%' }}
            expand="block"
            onClick={() => {
              history.push(akashicPayPath(importAccountUrl));
            }}
          >
            {t('KeyPair')}
          </PurpleButton>
        </IonRow>
        <IonRow>
          <WhiteButton
            style={{ width: '100%' }}
            fill="clear"
            onClick={() => {
              history.push(akashicPayPath(urls.secretPhraseImport));
            }}
          >
            {t('12Words')}
          </WhiteButton>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
