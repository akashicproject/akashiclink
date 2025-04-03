import './account-selection.scss';
import '../../pages/logged/logged.css';

import { Clipboard } from '@capacitor/clipboard';
import {
  IonContent,
  IonIcon,
  IonPopover,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { themeType } from '../../theme/const';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { SquareWhiteButton } from '../buttons';
import { useTheme } from '../PreferenceProvider';

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
 * @param onNewAccountClick to execute when an account is selected
 * @param hideCreateImport to add the "CreateAccount" + "ImportAccount" options
 * @param showCopyButton to show a button next to the menu for copying the diplayed address
 */
export function AccountSelection({
  onNewAccountClick,
  showCopyButton,
  hideCreateImport,
  style,
}: {
  onNewAccountClick?: (selectedAccount: LocalAccount) => void;
  showCopyButton?: boolean;
  hideCreateImport?: boolean;
  style?: CSSProperties;
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [storedTheme] = useTheme();

  const copyAddressPopover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const copyAddress = async (e: never) => {
    await Clipboard.write({
      string: selectedAccount?.identity ?? '',
    });

    if (copyAddressPopover.current) {
      copyAddressPopover.current.event = e;
    }
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  /**
   * Tracking of accounts
   */
  const { localAccounts, activeAccount } = useAccountStorage();
  const [selectedAccount, setSelectedAccount] = useState<LocalAccount>();

  /**
   * If there is an active account in the this browsing session
   * preselect it in the dropdown menu
   */
  useEffect(() => {
    if (activeAccount) {
      const matchingAccount = localAccounts?.find(
        (a) => a.username === activeAccount.username
      );
      setSelectedAccount(matchingAccount);
    } else {
      setSelectedAccount(localAccounts?.[0]);
    }
  }, [activeAccount, localAccounts]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '40px',
        justifyContent: 'space-between',
        gap: '15px',
        width: '100%',
        ...style,
      }}
    >
      <IonSelect
        style={{ flexGrow: 1 }}
        value={selectedAccount}
        onIonChange={({ detail: { value } }) => {
          if (value === DropdownOptions.CreateAccount) {
            history.push(
              akashicPayPath(urls.createWalletUrl),
              // Pass in a state, to differentiate from the case when extension is closed and reopened
              activeAccount
            );
            return;
          }
          if (value === DropdownOptions.ImportAccount) {
            history.push(
              akashicPayPath(urls.selectImportMethod),
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
          ...(hideCreateImport
            ? []
            : [
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
              ]),
        ]}
      </IonSelect>
      {showCopyButton ? (
        <SquareWhiteButton class="icon-button" onClick={copyAddress}>
          <IonIcon
            class="icon-button-icon"
            slot="icon-only"
            src={`/shared-assets/images/${
              storedTheme === themeType.DARK
                ? 'copy-icon-white.svg'
                : 'copy-icon-dark.svg'
            }`}
          />
          <IonPopover
            side="top"
            alignment="center"
            ref={copyAddressPopover}
            isOpen={popoverOpen}
            class={'copied-popover'}
            onDidDismiss={() => setPopoverOpen(false)}
          >
            <IonContent class="ion-padding">{t('Copied')}</IonContent>
          </IonPopover>
        </SquareWhiteButton>
      ) : null}
    </div>
  );
}
