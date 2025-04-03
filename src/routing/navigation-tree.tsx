import { IonRouterOutlet } from '@ionic/react';
import { Redirect } from 'react-router';

import { urls } from '../constants/urls';
import { Activity } from '../pages/activity';
import { AkashicPayMain } from '../pages/akashic-main';
import { ChangePasswordConfirm } from '../pages/changePassword/confirm';
import { ChangePassword } from '../pages/changePassword/enter-passwords';
import { CreateWalletPassword } from '../pages/createWallet/create-password';
import { CreateWallet } from '../pages/createWallet/create-wallet';
import { CreateWalletSecret } from '../pages/createWallet/create-wallet-secret';
import { CreateWalletSecretConfirm } from '../pages/createWallet/create-wallet-secret-confirm';
import { WalletCreated } from '../pages/createWallet/wallet-created';
import { ErrorPage } from '../pages/error';
import { ImportSuccess } from '../pages/importWallet/import-success';
import { KeyPairImport } from '../pages/importWallet/keypair-import';
import { SecretPhraseImport } from '../pages/importWallet/secret-phrase-import';
import { SelectImportMethod } from '../pages/importWallet/select-import-method';
import { Dashboard } from '../pages/logged/dashboard';
import { DepositPage } from '../pages/logged/deposit-page';
import { LoggedCreate } from '../pages/logged/logged-create';
import { ManageAccounts } from '../pages/manage-accounts';
import { Nft } from '../pages/nft/nft';
import { NftTransfer } from '../pages/nft/nft-transfer';
import { NftTransferResult } from '../pages/nft/nft-transfer-result';
import { Nfts } from '../pages/nft/nfts';
import { MigrateWalletCreatePassword } from '../pages/otkMigration/migrate-wallet-create-password';
import { MigrateWalletNotice } from '../pages/otkMigration/migrate-wallet-notice';
import { MigrateWalletSecret } from '../pages/otkMigration/migrate-wallet-secret';
import { MigrateWalletSecretConfirm } from '../pages/otkMigration/migrate-wallet-secret-confirm';
import { WalletMigrated } from '../pages/otkMigration/wallet-migrated';
import { RecoverCode } from '../pages/recover-code';
import { ChangePasswordAfterImport } from '../pages/Recovery/change-password-after-import';
import { SendConfirm } from '../pages/send/send-confirm';
import { SendResult } from '../pages/send/send-result';
import { SendTo } from '../pages/send/send-to';
import { Settings } from '../pages/settings';
import { SettingsBackup } from '../pages/settings-backup';
import { SettingsDelete } from '../pages/settings-delete';
import { SettingsNaming } from '../pages/settings-naming';
import { SettingsVersion } from '../pages/settings-version';
import { Us2Main } from '../pages/us2-main';
import { AkashicTab, Us2Tab } from './navigation-tabs';

/**
 * Definition of all the routing in the app
 */
export function NavigationTree() {
  return (
    <IonRouterOutlet animated={false}>
      {/* AkashicPay tree - default so redirect at bottom */}
      {AkashicTab.registerPage(AkashicPayMain)}
      {AkashicTab.registerPage(AkashicPayMain, urls.akashicPay)}
      {AkashicTab.registerPage(CreateWallet, urls.createWalletUrl)}
      {AkashicTab.registerPage(ManageAccounts, urls.manageAccounts)}
      {AkashicTab.registerPage(Dashboard, urls.loggedFunction)}
      {AkashicTab.registerPage(LoggedCreate, urls.loggedCreate)}
      {AkashicTab.registerPage(DepositPage, urls.loggedDeposit)}
      {AkashicTab.registerPage(SendConfirm, urls.sendConfirm)}
      {AkashicTab.registerPage(SendTo, urls.sendTo)}
      {AkashicTab.registerPage(SendResult, urls.sendResult)}
      {AkashicTab.registerPage(Nfts, urls.nfts)}
      {AkashicTab.registerPage(Nft, urls.nft)}
      {AkashicTab.registerPage(NftTransfer, urls.nftTransfer)}
      {AkashicTab.registerPage(NftTransferResult, urls.nftTransferResult)}
      {AkashicTab.registerPage(Activity, urls.activity)}
      {AkashicTab.registerPage(Settings, urls.settings)}
      {AkashicTab.registerPage(RecoverCode, urls.recoverCode)}
      {AkashicTab.registerPage(SettingsBackup, urls.settingsBackup)}
      {AkashicTab.registerPage(SettingsDelete, urls.settingsDelete)}
      {AkashicTab.registerPage(SettingsNaming, urls.settingsNaming)}
      {AkashicTab.registerPage(SettingsVersion, urls.settingsVersion)}
      {AkashicTab.registerPage(ChangePassword, urls.changePassword)}
      {AkashicTab.registerPage(
        ChangePasswordConfirm,
        urls.changePasswordConfirm
      )}
      {AkashicTab.registerPage(ErrorPage, urls.error)}
      {AkashicTab.registerPage(CreateWalletPassword, urls.createWalletPassword)}
      {AkashicTab.registerPage(CreateWalletSecret, urls.secret)}
      {AkashicTab.registerPage(WalletCreated, urls.walletCreated)}
      {AkashicTab.registerPage(CreateWalletSecretConfirm, urls.secretConfirm)}
      {AkashicTab.registerPage(SecretPhraseImport, urls.secretPhraseImport)}
      {AkashicTab.registerPage(SelectImportMethod, urls.selectImportMethod)}
      {AkashicTab.registerPage(ImportSuccess, urls.importSuccess)}
      {AkashicTab.registerPage(KeyPairImport, urls.keyPairImport)}
      {AkashicTab.registerPage(
        ChangePasswordAfterImport,
        urls.changePasswordAfterImport
      )}
      {AkashicTab.registerPage(MigrateWalletNotice, urls.migrateWalletNotice)}
      {AkashicTab.registerPage(MigrateWalletSecret, urls.migrateWalletSecret)}
      {AkashicTab.registerPage(
        MigrateWalletSecretConfirm,
        urls.migrateWalletSecretConfirm
      )}
      {AkashicTab.registerPage(
        MigrateWalletCreatePassword,
        urls.migrateWalletPassword
      )}
      {AkashicTab.registerPage(WalletMigrated, urls.migrateWalletComplete)}
      {/* US² tree */}
      {Us2Tab.registerPage(Us2Main)}

      {/* Default redirect */}
      {/* https://github.com/ionic-team/ionic-framework/issues/24855 */}
      <Redirect to={AkashicTab.root} />
      <Redirect exact from="/" to={AkashicTab.root} />
    </IonRouterOutlet>
  );
}
