import './manage-accounts.scss';

import { IonCol, IonIcon, IonRow, IonText } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { SquareWhiteButton } from '../components/buttons';
import { MainGrid } from '../components/layout/main-grid';
import { PublicLayout } from '../components/layout/public-layout';
import { AccountList } from '../components/manage-account/account-list';
import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tabs';
import { useOwner } from '../utils/hooks/useOwner';

export function ManageAccounts() {
  const history = useHistory();
  const { authenticated } = useOwner();

  const { t } = useTranslation();

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
            onClick={() =>
              history.replace(
                authenticated
                  ? akashicPayPath(urls.loggedFunction)
                  : akashicPayPath(urls.akashicPay)
              )
            }
          >
            <IonIcon
              className="icon-button-icon"
              slot="icon-only"
              icon={arrowBack}
            />
          </SquareWhiteButton>
        </IonRow>
        <IonRow className={'ion-grid-row-gap-xxl'}>
          <IonCol size="12">
            <h2 className={'ion-margin-bottom-xxs'}>{t('ManageAccounts')}</h2>
            <IonText
              className={'ion-text-align-center ion-text-size-xs'}
              color={'dark'}
            >
              <p className={'ion-margin-0'}>{t('RemoveDevice')}</p>
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
