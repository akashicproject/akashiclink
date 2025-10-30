export type Url = (typeof urls)[keyof typeof urls];
export const urls = {
  root: '/',
  akashicPay: 'akashic',
  welcome: 'welcome',
  dashboard: 'dashboard',
  nfts: 'nfts',
  nft: 'nft',
  nftTransfer: 'nft-transfer',
  nftTransferResult: 'nft-transfer-result',
  recoverCode: 'recover-code',
  // eslint-disable-next-line sonarjs/no-hardcoded-passwords
  changePassword: 'change-password',
  // eslint-disable-next-line sonarjs/no-hardcoded-passwords
  changePasswordConfirm: 'change-password-confirm',
  error: 'error',
  manageAccounts: 'manage-account',
  // eslint-disable-next-line sonarjs/no-hardcoded-passwords
  createWalletPassword: 'create-wallet-password',
  createWalletSecretPhrase: 'create-wallet-secret',
  createWalletSecretPhraseConfirm: 'create-wallet-secret-confirm',
  createWalletSuccessful: 'create-wallet-success',
  // eslint-disable-next-line sonarjs/no-hardcoded-passwords
  importWalletPassword: 'import-wallet-password',
  importWalletKeypair: 'import-wallet-keypair',
  importWalletSecretPhrase: 'import-wallet-secret-phrase',
  importWalletSelectMethod: 'import-wallet-select-method',
  importWalletSuccessful: 'import-wallet-success',
  activity: 'activity',
  activityDetails: 'activity/details',
  settings: 'settings',
  settingsGeneral: 'settings/general',
  settingsSecurity: 'settings/security',
  settingsNetwork: 'settings/network',
  settingsAboutUs: 'settings/about-us',
  settingsBackup: 'settings/backup',
  settingsVersion: 'settings/version',
  addressScreening: 'address-screening',
  addressScreeningDetails: 'address-screening/details',
} as const;

export const SUPPORT_MAIL = 'support@akashiclink.com';
