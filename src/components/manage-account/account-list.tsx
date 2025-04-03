import styled from '@emotion/styled';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { displayLongText } from '../../utils/long-text';
import { SquareWhiteButton } from '../common/buttons';
import { DeleteAccountModal } from './delete-account-modal';

const InitialDiv = styled.div({
  width: '32px',
  height: '32px',
  flex: '0 0 32px',
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

const IconAndLabel = styled(IonItem)({
  ['ion-label']: {
    ['h3']: {
      marginBottom: 0,
    },
    ['p']: {
      fontSize: '0.625rem',
      overflowWrap: 'anywhere',
    },
  },
});

export const AccountList = () => {
  const { t } = useTranslation();
  const { localAccounts } = useAccountStorage();
  const [alertOpen, setAlertOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<LocalAccount | null>(
    null
  );

  const onItemClick = (account: LocalAccount) => () => {
    setAccountToDelete(account);
    setAlertOpen(true);
  };

  const onCancelModal = () => {
    setAlertOpen(false);
  };

  return (
    <IonList>
      {localAccounts.map((account) => (
        <IconAndLabel key={account.identity}>
          <div
            className={'w-100 ion-margin-top ion-margin-bottom'}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <div
              className={'w-100'}
              style={{ display: 'flex', flexDirection: 'row', gap: 8 }}
            >
              <InitialDiv>AS</InitialDiv>
              <IonLabel>
                <h3 className={'ion-text-align-left ion-margin-bottom-0'}>
                  {displayLongText(account.identity)}
                </h3>
                <p className={'ion-text-align-left ion-text-size-xxs'}>
                  {account.identity}
                </p>
              </IonLabel>
            </div>
            <SquareWhiteButton size="small" onClick={onItemClick(account)}>
              {t('RemoveAccount')}
            </SquareWhiteButton>
          </div>
        </IconAndLabel>
      ))}
      {accountToDelete && (
        <DeleteAccountModal
          isOpen={alertOpen}
          account={accountToDelete}
          onCancel={onCancelModal}
        />
      )}
    </IonList>
  );
};
