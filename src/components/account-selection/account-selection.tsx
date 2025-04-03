import './account-selection.scss';
import '../page-layout/layout-with-activity-tab.scss';

import { Clipboard } from '@capacitor/clipboard';
import {
  IonContent,
  IonIcon,
  IonPopover,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { themeType } from '../../theme/const';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { displayLongText } from '../../utils/long-text';
import { SquareWhiteButton } from '../common/buttons';
import { useTheme } from '../providers/PreferenceProvider';

enum DropdownOptions {
  CreateAccount,
  ImportAccount,
  ManageAccount,
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
  size = 'lg',
}: {
  onNewAccountClick?: (selectedAccount: LocalAccount) => void;
  showCopyButton?: boolean;
  hideCreateImport?: boolean;
  size?: 'md' | 'lg';
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
        onIonChange={({ detail: { value } }) => {
          if (value === DropdownOptions.CreateAccount) {
            history.push(
              akashicPayPath(urls.createWalletPassword),
              // Pass in a state, to differentiate from the case when extension is closed and reopened
              activeAccount
            );
            return;
          }
          if (value === DropdownOptions.ImportAccount) {
            history.push(
              akashicPayPath(urls.importWalletSelectMethod),
              // Pass in a state, to differentiate from the case when extension is closed and reopened
              activeAccount
            );
            return;
          }
          if (value === DropdownOptions.ManageAccount) {
            history.push(akashicPayPath(urls.manageAccounts), activeAccount);
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
            <IonSelectOption key={account.identity} value={account}>
              {!showCopyButton
                ? displayLongText(account.identity, 26)
                : displayLongText(account.identity)}
            </IonSelectOption>
          )),
          ...(hideCreateImport
            ? []
            : [
                <IonSelectOption
                  className="option-divider-top"
                  key={DropdownOptions.CreateAccount}
                  value={DropdownOptions.CreateAccount}
                >
                  {t('CreateWallet')}
                </IonSelectOption>,
                <IonSelectOption
                  className="option-divider-bottom"
                  key={DropdownOptions.ImportAccount}
                  value={DropdownOptions.ImportAccount}
                >
                  {t('ImportWallet')}
                </IonSelectOption>,
                <IonSelectOption
                  key={DropdownOptions.ManageAccount}
                  value={DropdownOptions.ManageAccount}
                  className="settings-icon"
                >
                  {t('ManageAccounts')}
                </IonSelectOption>,
              ]),
        ]}
      </IonSelect>
      {showCopyButton ? (
        <SquareWhiteButton className="icon-button" onClick={copyAddress}>
          <IonIcon
            className="icon-button-icon"
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
            className={'copied-popover'}
            onDidDismiss={() => setPopoverOpen(false)}
          >
            <IonContent class="ion-padding">{t('Copied')}</IonContent>
          </IonPopover>
        </SquareWhiteButton>
      ) : null}
    </div>
  );
}
