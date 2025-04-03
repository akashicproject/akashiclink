import styled from '@emotion/styled';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonImg,
  IonModal,
  IonText,
  IonToolbar,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { displayLongText } from '../../utils/long-text';
import { PurpleButton, WhiteButton } from '../buttons';
import { useLogout } from '../logout';

const FlexDiv = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const DeleteAccountModal = ({
  isOpen,
  onCancel,
  account,
}: {
  isOpen: boolean;
  onCancel: () => void;
  account: LocalAccount;
}) => {
  const { t } = useTranslation();
  const {
    localAccounts,
    removeLocalAccount,
    activeAccount,
    clearActiveAccount,
  } = useAccountStorage();
  const logout = useLogout();

  const onConfirm = async () => {
    await removeLocalAccount(account);

    // if removing the last accounts save or removing the current account, logs out user
    if (
      localAccounts.length === 1 ||
      activeAccount?.identity === account.identity
    ) {
      await clearActiveAccount();
      await logout();
    }

    onCancel();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onCancel}
      className="custom-alert delete-modal"
    >
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={onCancel}>
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
          <h3 className={'ion-margin-0'}>{t('RemoveTheAccount')}</h3>
          <h3 className={'ion-margin-0'}>
            {displayLongText(account ? account.identity : '')}
          </h3>
          <IonText
            className={'ion-text-align-center ion-text-size-xs'}
            color={'dark'}
          >
            <p>{t('UnsavedDataWillBeRemoved')}</p>
          </IonText>
        </div>
        <PurpleButton className={'w-100'} onClick={onConfirm} expand="block">
          {t('RemoveAccount')}
        </PurpleButton>
        <WhiteButton className={'w-100'} expand="block" onClick={onCancel}>
          {t('Cancel')}
        </WhiteButton>
      </FlexDiv>
    </IonModal>
  );
};
