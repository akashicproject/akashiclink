import { createWalletUrl } from '../pages/createWallet/create-wallet';
import { importAccountUrl } from '../pages/import-wallet';
import { loginUrl } from '../pages/login';

export const urls = {
  heliumPay: 'hp',
  beforeCreateWallet: 'before-create-wallet',
  createWalletUrl,
  recovery: 'recovery',
  resetPassword: 'reset-password',
  verification: 'verification',
  loginUrl,
  importAccountUrl,
  welcome: 'welcome',
  loggedFunction: 'logged-function',
  loggedCreate: 'logged-create',
  loggedDeposit: 'logged-deposit/:coinSymbol',
  sendFunction: 'send-function',
  sendTo: 'send-to/:coinSymbol',
  sendConfirm: 'send-confirm',
  sendResult: 'send-result',
  activity: 'activity',
  recover: 'recover',
  recoverCode: 'recover-code',
  dashboard: 'dashboard',
  settings: 'settings',
  send: 'send',
  settingsLanguage: 'settings-language',
  settingsBackup: 'settings-backup',
  settingsNaming: 'settings-naming',
  settingsInfo: 'settings-info',
  settingsVersion: 'settings-version',
  error: 'error',

  us2: 'us2',
} as const;
