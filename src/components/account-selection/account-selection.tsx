import './account-selection.scss';
import '../../pages/logged/logged.css';

import { Clipboard } from '@capacitor/clipboard';
import { IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';

/**
 * Options in the dropdown menu in addition to regular account selection
 */
enum DropdownOptions {
  CreateAccount,
  ImportAccount,
}

/**
 * Dropdown menu to offer the locally stored account
 *
 * @param onClickCallback to execute when an account is selected
 * @param changeSelection for data binding in external component
 */
export function AccountSelection({
  onClickCallback,
  changeSelection,
  isCopyButton,
  style,
}: {
  onClickCallback?: (selectedAccount: LocalAccount) => void;
  changeSelection?: (selectedAccount: LocalAccount) => void;
  isCopyButton?: boolean;
  style?: CSSProperties;
}) {
  const history = useHistory();
  const { t } = useTranslation();

  /**
   * Tracking of accounts
   */
  const { localAccounts, activeAccount } = useAccountStorage();
  const [selectedAccount, setSelectedAccount] = useState<LocalAccount>();

  /**
   * Selection is populated on load to match the account save in session
   * TODO: still cannot figure out why the session is being read but can't be set
   */
  useEffect(() => {
    if (activeAccount) {
      const matchingAccount = localAccounts.find(
        (a) => a.identity === activeAccount.identity
      );
      setSelectedAccount(matchingAccount);
    } else {
      setSelectedAccount(localAccounts[0]);
    }
  }, [activeAccount, localAccounts]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '15px',
        width: '100%',
        ...style,
      }}
    >
      <IonSelect
        style={{ maxWidth: isCopyButton ? '190px' : null }}
        value={selectedAccount}
        onIonChange={({ detail: { value } }) => {
          setSelectedAccount(value);

          // Handle button clicks
          if (value === DropdownOptions.CreateAccount) {
            history.push(akashicPayPath(urls.createWalletUrl));
            return;
          }
          if (value === DropdownOptions.ImportAccount) {
            history.push(akashicPayPath(urls.importAccountUrl));
            return;
          }

          // Skip the callbacks until account selection is made
          if (selectedAccount && onClickCallback) onClickCallback(value);

          // Handle selection
          if (changeSelection) changeSelection(value);
        }}
        interface="popover"
        interfaceOptions={{
          className: 'account-selection',
          side: 'bottom',
          size: 'cover',
        }}
      >
        {[
          ...localAccounts.map((account) => (
            <IonSelectOption key={account.username} value={account}>
              {account.identity}
            </IonSelectOption>
          )),
          <IonSelectOption
            key={DropdownOptions.CreateAccount}
            value={DropdownOptions.CreateAccount}
          >
            {t('CreateWallet')}
          </IonSelectOption>,
          <IonSelectOption
            key={DropdownOptions.ImportAccount}
            value={DropdownOptions.ImportAccount}
          >
            {t('ImportWallet')}
          </IonSelectOption>,
        ]}
      </IonSelect>
      {isCopyButton ? (
        <IonButton
          class="icon-button"
          onClick={async () =>
            await Clipboard.write({
              string: selectedAccount?.identity ?? '',
            })
          }
        >
          <IonIcon
            class="icon-button-icon"
            slot="icon-only"
            icon={copyOutline}
          />
        </IonButton>
      ) : null}
    </div>
  );
}
