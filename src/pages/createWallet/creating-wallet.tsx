import './create-wallet.css';

import styled from '@emotion/styled';
import { IonCol, IonProgressBar, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import { MainGrid } from '../../components/layout/main-grid';
import { MainLayout } from '../../components/layout/mainLayout';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';

const ContentText = styled.span({
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  fontFamily: 'Nunito Sans',
  color: '#290056',
});

export function CreatingWallet() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 0.01);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (progress > 1) {
    return <Redirect to={heliumPayPath(urls.walletCreated)} />;
  }
  return (
    <MainLayout>
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
    </MainLayout>
  );
}
