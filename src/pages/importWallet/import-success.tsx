import styled from '@emotion/styled';
import { IonCol, IonImg, IonRow } from '@ionic/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
} from '../../utils/last-page-storage';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});
export const ImportSuccess = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useEffect(() => {
    cacheCurrentPage(urls.importSuccess, NavigationPriority.IMMEDIATE);
  }, []);

  return (
    <PublicLayout contentStyle={{ padding: '0 30px', height: '100%' }}>
      <MainGrid style={{ gap: '40px', padding: '112px 30px', height: '100%' }}>
        <IonCol
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <IonRow style={{ justifyContent: 'center' }}>
            <IonImg
              alt={''}
              src={'/shared-assets/images/right.png'}
              style={{ width: '40px', height: '40px' }}
            />
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h4>{t('ImportSuccessful')}</h4>
            </div>
          </IonRow>
          <IonRow>
            <div
              className="w-100"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textAlign: 'center',
              }}
            >
              <PurpleButton
                onClick={async () => {
                  await lastPageStorage.clear();
                  history.push(akashicPayPath(urls.akashicPay));
                }}
              >
                {t('Confirm')}
              </PurpleButton>
              {/** TODO: Re-enable with different flow at later stage */}
              {/* <Divider/>>
            <StyledSpan>{t('YouHaveOptionTo')}</StyledSpan>
            <WhiteButton
              onClick={() => {
                history.push(akashicPayPath(urls.changePasswordAfterImport));
              }}
            >
              {t('ChangePassword')}
            </WhiteButton> */}
            </div>
          </IonRow>
        </IonCol>
      </MainGrid>
    </PublicLayout>
  );
};
