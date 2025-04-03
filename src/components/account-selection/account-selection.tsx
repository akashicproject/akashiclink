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
import { CopyButton } from '../common/copy-button';

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
  showCopyButton,
  hideCreateImport,
  size = 'lg',
}: {
  onNewAccountClick?: (selectedAccount: LocalAccount) => void;
  showCopyButton?: boolean;
  hideCreateImport?: boolean;
  size?: 'md' | 'lg';
}) {
  const history = useHistory();
  const { t } = useTranslation();

  const { localAccounts, activeAccount } = useAccountStorage();
  const [selectedAccount, setSelectedAccount] = useState<LocalAccount>();

  // preselect active account in this browsing session in the dropdown menu
  useEffect(() => {
    if (activeAccount) {
      const matchingAccount = localAccounts?.find(
        (a) =>
          (typeof a.username !== 'undefined' &&
            a.username === activeAccount.username) ||
          a.identity === activeAccount.identity
      );

      setSelectedAccount(matchingAccount ?? localAccounts?.[0]);
    } else {
      setSelectedAccount(localAccounts?.[0]);
    }
  }, [activeAccount, localAccounts]);

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

    if (!selectedAccount) {
      setSelectedAccount(value);
    }
    // When new account is selected trigger callback
    if (selectedAccount && value !== selectedAccount) {
      setSelectedAccount(value);
      if (onNewAccountClick) onNewAccountClick(value);
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
        value={selectedAccount}
        onIonChange={onSelect}
        interface="popover"
        interfaceOptions={{
          className: 'account-selection',
          side: 'bottom',
          size: 'cover',
        }}
      >
        {[
          ...localAccounts.map((account, index) => {
            const accountPrefix = account.aasName ?? `Account ${index + 1}`;

            return (
              <IonSelectOption key={account.identity} value={account}>
                {!showCopyButton
                  ? `${accountPrefix} - ${displayLongText(
                      account.identity,
                      20
                    )}`
                  : `${displayLongText(account.identity, 16)}`}
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
      {showCopyButton && selectedAccount?.identity && (
        <CopyButton value={selectedAccount?.identity} />
      )}
    </div>
  );
}
