import styled from '@emotion/styled';
import { IonCol, IonIcon, IonRow } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  PurpleButton,
  SquareWhiteButton,
  WhiteButton,
} from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { urls } from '../../constants/urls';
import { historyGoBack } from '../../routing/history-stack';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useOwner } from '../../utils/hooks/useOwner';
import { importAccountUrl, View } from '../import-wallet';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
  letterSpacing: '0.4px',
});

export const SelectImportMethod = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const loginCheck = useOwner(true);

  return (
    <PublicLayout contentStyle={{ padding: '0 30px' }}>
      <SquareWhiteButton
        className="icon-button"
        onClick={() => {
          historyGoBack(
            history,
            !loginCheck.isLoading && !loginCheck.authenticated
          );
        }}
      >
        <IonIcon className="icon-button-icon" slot="icon-only" icon={arrowBack} />
      </SquareWhiteButton>
      <MainGrid style={{ gap: '16px', padding: '102px 15px' }}>
        <IonRow>
          <IonCol style={{ textAlign: 'center' }}>
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
              history.push(akashicPayPath(importAccountUrl), {
                initalView: View.SubmitRequest,
              });
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
