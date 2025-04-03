import './manage-accounts.scss';

import styled from '@emotion/styled';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonIcon,
  IonImg,
  IonList,
  IonModal,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import { arrowBack, closeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  PurpleButton,
  SquareWhiteButton,
  WhiteButton,
} from '../components/buttons';
import { MainGrid } from '../components/layout/main-grid';
import { PublicLayout } from '../components/layout/public-layout';
import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tabs';
import type { LocalAccount } from '../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { displayLongText } from '../utils/long-text';
import { Divider } from './send/send-to';

const InitialDiv = styled.div({
  width: '32px',
  height: '32px',
  borderRadius: '32px',
  background: '#7444B6',
  margin: '0px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'inline-flex',
  color: '#FFFFFF',
  fontSize: '12px',
  fontWeight: '700',
});
const FlexDiv = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});
export function ManageAccounts() {
  const history = useHistory();
  const { localAccounts, removeLocalAccount } = useAccountStorage();
  const [alertOpen, setAlertOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<LocalAccount | null>(
    null
  );
  const { t } = useTranslation();
  function DeleteConformation() {
    /**
     * Modal for delete confirmation
     */
    return (
      <IonModal
        isOpen={alertOpen}
        onDidDismiss={() => {
          setAlertOpen(false);
          setAccountToDelete(null);
        }}
        className="custom-alert delete-modal"
      >
        <IonToolbar color="#ffffff">
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setAlertOpen(false);
                setAccountToDelete(null);
              }}
            >
              <IonIcon
                className="icon-button-icon"
                slot="icon-only"
                icon={closeOutline}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <FlexDiv className="warning">
          <IonImg
            alt={''}
            src={'/shared-assets/images/error-outline.png'}
            style={{ width: '48px', height: '48px' }}
          />
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0px' }}>
              {t('RemoveTheAccount')}
              {displayLongText(accountToDelete ? accountToDelete.identity : '')}
            </h4>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--ion-color-primary-10)',
                fontWeight: '700',
              }}
            >
              {t('UnsavedDataWillBeRemoved')}
            </span>
          </div>
          <PurpleButton
            onClick={() => {
              removeLocalAccount(accountToDelete!);
              setAlertOpen(false);
              setAccountToDelete(null);
            }}
            style={{ width: '100%' }}
            expand="block"
          >
            {t('RemoveAccount')}
          </PurpleButton>
          <WhiteButton
            expand="block"
            style={{ width: '100%' }}
            onClick={() => {
              setAlertOpen(false);
              setAccountToDelete(null);
            }}
          >
            {t('Cancel')}
          </WhiteButton>
        </FlexDiv>
      </IonModal>
    );
  }
  return (
    <PublicLayout contentStyle={{ padding: '0 40px' }}>
      <MainGrid style={{ padding: '0px' }}>
        <IonRow style={{ justifyContent: 'start' }}>
          <SquareWhiteButton
            className="icon-button"
            style={{
              height: '40px',
              width: '40px',
            }}
            onClick={() => history.push(akashicPayPath(urls.akashicPay))}
          >
            <IonIcon
              className="icon-button-icon"
              slot="icon-only"
              icon={arrowBack}
            />
          </SquareWhiteButton>
        </IonRow>
        <IonRow>
          <IonCol size="12">
            <h2 style={{ marginBottom: '5px' }}>{t('ManageAccounts')}</h2>
            <h5>{t('RemoveDevice')}</h5>
          </IonCol>
          <IonList style={{ width: '100%', padding: '40px 0px' }}>
            {localAccounts.map((account, index) => {
              return (
                <FlexDiv
                  key={account.identity}
                  style={{ marginTop: index != 0 ? '16px' : '0px' }}
                >
                  <IonRow>
                    <IonCol size="2">
                      <InitialDiv>AS</InitialDiv>
                    </IonCol>
                    <IonCol size="10">
                      <IonRow>
                        <h4 style={{ margin: '0px' }}>
                          {displayLongText(account.identity)}
                        </h4>
                      </IonRow>
                      <IonRow style={{ fontSize: '8px', color: '#B0A9B3' }}>
                        {account.identity}
                      </IonRow>
                    </IonCol>
                  </IonRow>
                  <SquareWhiteButton
                    forceStyle={{
                      height: '32px',
                      width: '50%',
                      padding: '6px 12px',
                    }}
                    onClick={() => {
                      setAccountToDelete(account);
                      setAlertOpen(true);
                    }}
                  >
                    {t('RemoveAccount')}
                  </SquareWhiteButton>
                  <Divider />
                </FlexDiv>
              );
            })}
          </IonList>
        </IonRow>
        <DeleteConformation />
      </MainGrid>
    </PublicLayout>
  );
}
