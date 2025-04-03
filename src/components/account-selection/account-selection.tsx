import './account-selection.scss';
import '../page-layout/layout-with-activity-tab.scss';

import type { IonSelectCustomEvent } from '@ionic/core/dist/types/components';
import type { SelectChangeEventDetail } from '@ionic/react';
import { IonSelect, IonSelectOption } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { displayLongText } from '../../utils/long-text';

const ACCOUNT_OPERATION_OPTIONS = [
  {
    tKey: 'CreateWallet',
    url: urls.createWalletPassword,
  },
  {
    tKey: 'ImportWallet',
    url: urls.importWalletSelectMethod,
  },
  {
    tKey: 'ManageAccounts',
    url: urls.manageAccounts,
  },
];

export function AccountSelection({
  onNewAccountClick,
  hideCreateImport,
  size = 'lg',
  currentSelectedAccount,
}: {
  onNewAccountClick?: (selectedAccount: LocalAccount) => void;
  hideCreateImport?: boolean;
  size?: 'md' | 'lg';
  currentSelectedAccount?: LocalAccount;
}) {
  const history = useHistory();
  const { t } = useTranslation();

  const { localAccounts, activeAccount } = useAccountStorage();
  const [selectedAccount, setSelectedAccount] = useState<LocalAccount>();

  // preselect active account in this browsing session in the dropdown menu
  useEffect(() => {
    if (currentSelectedAccount) {
      setSelectedAccount(currentSelectedAccount);
    } else if (activeAccount) {
      const matchingAccount = localAccounts?.find(
        (a) => a.identity === activeAccount.identity
      );
      setSelectedAccount(matchingAccount ?? localAccounts?.[0]);
    } else {
      setSelectedAccount(localAccounts?.[0]);
    }
  }, [activeAccount, localAccounts.length]);

  const onSelect = ({
    detail: { value },
  }: IonSelectCustomEvent<SelectChangeEventDetail>) => {
    if (ACCOUNT_OPERATION_OPTIONS.map((option) => option.url).includes(value)) {
      history.push(
        akashicPayPath(value),
        // Pass in a state, to differentiate from the case when extension is closed and reopened
        activeAccount
      );
      return;
    }

    const accountSelectedByUser = localAccounts.find(
      (account) => account.identity === value
    );

    if (!selectedAccount && accountSelectedByUser) {
      setSelectedAccount(accountSelectedByUser);
      return;
    }

    // When new account is selected trigger callback
    if (
      selectedAccount &&
      accountSelectedByUser &&
      value !== selectedAccount.identity
    ) {
      setSelectedAccount(accountSelectedByUser);
      onNewAccountClick && onNewAccountClick(accountSelectedByUser);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <IonSelect
        className="account-selections-options"
        style={{
          flexGrow: 1,
          padding: '0px 8px 0px 16px',
          height: size === 'lg' ? 40 : 32,
          minHeight: size === 'lg' ? 40 : 32,
          minWidth: '0',
        }}
        value={selectedAccount?.identity}
        onIonChange={onSelect}
        interface="popover"
        interfaceOptions={{
          className: 'account-selection',
          side: 'bottom',
          size: 'cover',
        }}
      >
        {[
          ...localAccounts.map((account) => {
            const accountPrefix =
              account.aasName ?? account?.accountName ?? `Account`;

            return (
              <IonSelectOption key={account.identity} value={account.identity}>
                {`${accountPrefix} - ${displayLongText(account.identity, 20)}`}
              </IonSelectOption>
            );
          }),
          ...(hideCreateImport
            ? []
            : ACCOUNT_OPERATION_OPTIONS.map((option, i) => (
                <IonSelectOption
                  className={i === 0 || i === 2 ? 'option-divider-top' : ''}
                  key={option.tKey}
                  value={option.url}
                >
                  {t(option.tKey)}
                </IonSelectOption>
              ))),
        ]}
      </IonSelect>
    </div>
  );
}
