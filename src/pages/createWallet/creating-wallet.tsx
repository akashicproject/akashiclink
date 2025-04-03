import './create-wallet.scss';

import { IonBackdrop, IonCol, IonProgressBar, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MainGrid } from '../../components/layout/main-grid';
import { ContentText } from '../../components/text/context-text';

/**
 * Popover to hover over the creationg content
 * during account creation the the backend
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
    <>
      <IonBackdrop />
      <MainGrid className="creating-wallet">
        <IonRow>
          <IonCol>
            <IonProgressBar value={progress} color="primary"></IonProgressBar>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-center">
            <ContentText>{t('CreatingYourWallet')}</ContentText>
          </IonCol>
        </IonRow>
      </MainGrid>
    </>
  );
}
