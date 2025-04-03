import { IonRouterOutlet } from '@ionic/react';
import { Redirect } from 'react-router';

import { urls } from '../constants/urls';
import { Activity } from '../pages/activity';
import { AkashicPayMain } from '../pages/akashic-main';
import { ChangePasswordConfirm } from '../pages/changePassword/confirm';
import { ChangePassword } from '../pages/changePassword/enter-passwords';
import { CreateWalletPassword } from '../pages/createWallet/create-wallet-create-password';
import { CreateWalletSecret } from '../pages/createWallet/create-wallet-secret';
import { CreateWalletSecretConfirm } from '../pages/createWallet/create-wallet-secret-confirm';
import { CreateWalletSuccessful } from '../pages/createWallet/create-wallet-successful';
import { ErrorPage } from '../pages/error';
import { ImportWalletKeypair } from '../pages/importWallet/import-wallet-keypair';
import { ImportWalletPassword } from '../pages/importWallet/import-wallet-password';
import { ImportWalletSecret } from '../pages/importWallet/import-wallet-secret';
import { ImportWalletSelectMethod } from '../pages/importWallet/import-wallet-select-method';
import { ImportWalletSuccessful } from '../pages/importWallet/import-wallet-successful';
import { Dashboard } from '../pages/logged/dashboard';
import { DepositPage } from '../pages/logged/deposit-page';
import { ManageAccounts } from '../pages/manage-accounts';
import { Nft } from '../pages/nft/nft';
import { NftTransfer } from '../pages/nft/nft-transfer';
import { NftTransferResult } from '../pages/nft/nft-transfer-result';
import { Nfts } from '../pages/nft/nfts';
import { MigrateWalletCreatePassword } from '../pages/otkMigration/migrate-wallet-create-password';
import { MigrateWalletOldPassword } from '../pages/otkMigration/migrate-wallet-enter-old-password';
import { MigrateWalletNotice } from '../pages/otkMigration/migrate-wallet-notice';
import { MigrateWalletSecret } from '../pages/otkMigration/migrate-wallet-secret';
import { MigrateWalletSecretConfirm } from '../pages/otkMigration/migrate-wallet-secret-confirm';
import { MigrateWalletSuccessful } from '../pages/otkMigration/migrate-wallet-successful';
import { RecoverCode } from '../pages/recover-code';
import { ChangePasswordAfterImport } from '../pages/recovery/change-password-after-import';
import { SendConfirm } from '../pages/send/send-confirm';
import { SendResult } from '../pages/send/send-result';
import { SendTo } from '../pages/send/send-to';
import { Settings } from '../pages/settings/settings';
import { SettingsBackup } from '../pages/settings/settings-backup';
import { SettingsNaming } from '../pages/settings/settings-naming';
import { SettingsVersion } from '../pages/settings/settings-version';
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
      {AkashicTab.registerPage(ManageAccounts, urls.manageAccounts)}
      {AkashicTab.registerPage(Dashboard, urls.loggedFunction)}
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
      {AkashicTab.registerPage(SettingsNaming, urls.settingsNaming)}
      {AkashicTab.registerPage(SettingsVersion, urls.settingsVersion)}
      {AkashicTab.registerPage(ChangePassword, urls.changePassword)}
      {AkashicTab.registerPage(
        ChangePasswordConfirm,
        urls.changePasswordConfirm
      )}
      {AkashicTab.registerPage(ErrorPage, urls.error)}
      {/* create wallet flow */}
      {AkashicTab.registerPage(CreateWalletPassword, urls.createWalletPassword)}
      {AkashicTab.registerPage(
        CreateWalletSecret,
        urls.createWalletSecretPhrase
      )}
      {AkashicTab.registerPage(
        CreateWalletSecretConfirm,
        urls.createWalletSecretPhraseConfirm
      )}
      {AkashicTab.registerPage(
        CreateWalletSuccessful,
        urls.createWalletSuccessful
      )}
      {/* import wallet flow */}
      {AkashicTab.registerPage(
        ImportWalletSecret,
        urls.importWalletSecretPhrase
      )}
      {AkashicTab.registerPage(ImportWalletPassword, urls.importWalletPassword)}
      {AkashicTab.registerPage(
        ImportWalletSelectMethod,
        urls.importWalletSelectMethod
      )}
      {AkashicTab.registerPage(
        ImportWalletSuccessful,
        urls.importWalletSuccessful
      )}
      {AkashicTab.registerPage(ImportWalletKeypair, urls.importWalletKeypair)}
      {AkashicTab.registerPage(
        ChangePasswordAfterImport,
        urls.changePasswordAfterImport
      )}
      {/* migrate wallet flow */}
      {AkashicTab.registerPage(MigrateWalletNotice, urls.migrateWalletNotice)}
      {AkashicTab.registerPage(MigrateWalletSecret, urls.migrateWalletSecret)}
      {AkashicTab.registerPage(
        MigrateWalletSecretConfirm,
        urls.migrateWalletSecretConfirm
      )}
      {AkashicTab.registerPage(
        MigrateWalletOldPassword,
        urls.migrateWalletOldPassword
      )}
      {AkashicTab.registerPage(
        MigrateWalletCreatePassword,
        urls.migrateWalletPassword
      )}
      {AkashicTab.registerPage(
        MigrateWalletSuccessful,
        urls.migrateWalletComplete
      )}
      {/* US² tree */}
      {Us2Tab.registerPage(Us2Main)}

      {/* Default redirect */}
      {/* https://github.com/ionic-team/ionic-framework/issues/24855 */}
      <Redirect to={AkashicTab.root} />
      <Redirect exact from="/" to={AkashicTab.root} />
    </IonRouterOutlet>
  );
}
