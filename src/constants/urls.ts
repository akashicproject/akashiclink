import { createWalletUrl } from '../pages/createWallet/create-wallet';
import { importAccountUrl } from '../pages/import-wallet';
import { recoveryUrl } from '../pages/Recovery/recovery';

export type Url = typeof urls[keyof typeof urls];
export const urls = {
  akashicPay: 'akashic',
  beforeCreateWallet: 'before-create-wallet',
  createWalletUrl,
  recoveryUrl,
  resetPassword: 'reset-password',
  verification: 'verification',
  importAccountUrl,
  welcome: 'welcome',
  loggedFunction: 'logged-function',
  loggedCreate: 'logged-create',
  loggedDeposit: 'logged-deposit',
  sendFunction: 'send-function',
  sendTo: 'send-to',
  sendConfirm: 'send-confirm',
  sendResult: 'send-result',
  nfts: 'nfts',
  nft: 'nft',
  nftTransfer: 'nft-transfer',
  activity: 'activity',
  recover: 'recover',
  recoverCode: 'recover-code',
  dashboard: 'dashboard',
  settings: 'settings',
  send: 'send',
  settingsBackup: 'settings-backup',
  settingsDelete: 'settings-delete',
  settingsNaming: 'settings-naming',
  settingsVersion: 'settings-version',
  error: 'error',
  us2: 'us2',
} as const;
