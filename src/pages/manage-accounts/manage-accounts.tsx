import { IonCol, IonIcon, IonRow, IonText } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import { SquareWhiteButton } from '../../components/common/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { AccountList } from '../../components/manage-account/account-list';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { urls } from '../../constants/urls';
import { historyGoBackOrReplace } from '../../routing/history';
import { useOwner } from '../../utils/hooks/useOwner';

export function ManageAccounts() {
  const { authenticated } = useOwner();

  const { t } = useTranslation();

  const onClickBackButton = () => {
    historyGoBackOrReplace(authenticated ? urls.dashboard : urls.akashicPay);
  };

  return (
    <PublicLayout>
      <MainGrid>
        <IonRow style={{ justifyContent: 'start' }}>
          <SquareWhiteButton
            className="icon-button"
            style={{
              height: '40px',
              width: '40px',
            }}
            onClick={onClickBackButton}
          >
            <IonIcon
              className="icon-button-icon"
              slot="icon-only"
              icon={arrowBack}
            />
          </SquareWhiteButton>
        </IonRow>
        <IonRow className={'ion-grid-row-gap-lg'}>
          <IonCol size="12">
            <h2 className={'ion-margin-bottom-xxs'}>{t('ManageAccounts')}</h2>
            <IonText
              className={'ion-text-align-center ion-text-size-xs'}
              color={'dark'}
            >
              <p className={'ion-text-align-center ion-margin-0'}>
                {t('RemoveDevice')}
              </p>
            </IonText>
          </IonCol>
          <IonCol size="12">
            <AccountList />
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
