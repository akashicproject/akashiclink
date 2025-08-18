import styled from '@emotion/styled';
import { IonList, isPlatform } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { getAccountUniqueId, isSameAccount } from '../../utils/account';
import { useFetchAndRemapAASToAddress } from '../../utils/hooks/useFetchAndRemapAASToAddress';
import { useFetchAndRemapL1Address } from '../../utils/hooks/useFetchAndRemapL1address';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useLogout } from '../../utils/hooks/useLogout';
import { AccountListItem } from './account-list-item';
import { AccountManagementList } from './account-management-list';
import { DeleteAccountModal } from './delete-account-modal';

const StyledList = styled(IonList)({
  ['&&']: {
    backgroundColor: 'transparent',
    marginBottom: 16,
    paddingBottom: 8,
    overflowY: 'scroll',
  },
});

interface AccountListProps {
  style?: React.CSSProperties;
  height?: string;
  setManageAccountsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  showManagementButtons?: boolean;
}
export const AccountList: React.FC<AccountListProps> = ({
  height,
  style,
  setManageAccountsModalOpen,
  showManagementButtons = true,
}) => {
  const { localAccounts, activeAccount, setActiveAccount } =
    useAccountStorage();
  const fetchAndRemapL1Address = useFetchAndRemapL1Address();
  const fetchAndRemapAASToAddress = useFetchAndRemapAASToAddress();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<LocalAccount | null>(
    null
  );
  const isMobile = isPlatform('ios') || isPlatform('android');
  const logout = useLogout();

  const onDeleteAccountClick = (account: LocalAccount) => () => {
    setAccountToDelete(account);
    setIsAlertOpen(true);
  };

  const onCancelModal = () => {
    setIsAlertOpen(false);
  };

  const onSelectAccountClick = (account: LocalAccount) => async () => {
    if (!activeAccount || isSameAccount(account, activeAccount)) return;

    await logout();
    setActiveAccount(account);
    setManageAccountsModalOpen && setManageAccountsModalOpen(false);
  };

  // fetch the latest info regarding the accounts
  // this component unmounts and mounts several times, so we can make sure the latest copy of localAccounts is used
  useEffect(() => {
    fetchAndRemapL1Address();
    if (activeAccount) {
      fetchAndRemapAASToAddress({
        identity: activeAccount?.identity,
        otkType: activeAccount?.otkType,
      });
    }
  }, []);

  return (
    <>
      <StyledList
        style={{
          height: height
            ? height
            : `calc(100vh - ${
                isMobile ? '320px - var(--ion-safe-area-bottom)' : '280px'
              })`,
          ...style,
        }}
        lines={'full'}
      >
        {localAccounts.map((account, i) => (
          <AccountListItem
            lines={i === localAccounts.length - 1 ? 'none' : 'full'}
            isActive={
              activeAccount ? isSameAccount(account, activeAccount) : false
            }
            button
            key={getAccountUniqueId(account)}
            onClick={
              isDeleting
                ? onDeleteAccountClick(account)
                : onSelectAccountClick(account)
            }
            showDeleteIcon={isDeleting}
            account={account}
          />
        ))}
      </StyledList>
      {showManagementButtons && (
        <AccountManagementList
          isDeleting={isDeleting}
          onClickRemove={() => setIsDeleting(!isDeleting)}
        />
      )}
      {accountToDelete && (
        <DeleteAccountModal
          setManageAccountsModalOpen={setManageAccountsModalOpen}
          isOpen={isAlertOpen}
          account={accountToDelete}
          onCancel={onCancelModal}
        />
      )}
    </>
  );
};
