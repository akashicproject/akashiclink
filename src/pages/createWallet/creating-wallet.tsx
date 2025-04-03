import './create-wallet.css';

import styled from '@emotion/styled';
import { IonCol, IonProgressBar, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MainGrid } from '../../components/layout/main-grid';

const ContentText = styled.span({
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Nunito Sans',
  color: '#290056',
});

/**
 * Progress bar to show user creation process
 */
export function CreatingWallet() {
  const { t } = useTranslation();
  const maxWaitTimeMs = 2000;

  const [progress, setProgress] = useState(0);

  /**
   * Load the progress bar
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 0.01);
    }, maxWaitTimeMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <MainGrid>
      <IonRow>
        <IonCol>
          <IonProgressBar
            value={progress}
            color="primary"
            class="progress-bar"
          ></IonProgressBar>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <ContentText>{t('CreatingYourWallet')}</ContentText>
        </IonCol>
      </IonRow>
    </MainGrid>
  );
}
