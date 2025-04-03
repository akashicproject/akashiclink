import type { IImportWalletResponse } from '@helium-pay/backend';

export interface CachedAccount {
  identity: string;
  username: string;
}

const cachedAccountField = 'cached-account';

/**
 * Store a username-identity pair in the local storage list
 * When user attempts a new login, offer the choice from one of these wallets
 */
export function storeAccount(account: IImportWalletResponse) {
  const cachedAccounts = JSON.parse(
    localStorage.getItem(cachedAccountField) || '[]'
  ) as CachedAccount[];

  // Do not add duplicate accounts
  for (const { identity, username } of cachedAccounts) {
    if (identity === account.identity && username === account.username) return;
  }

  localStorage.setItem(
    cachedAccountField,
    JSON.stringify([
      ...cachedAccounts,
      {
        identity: account.identity || 'undefined',
        username: account.username,
      },
    ])
  );
}

export function unpackCachedAccounts(): CachedAccount[] {
  return JSON.parse(localStorage.getItem(cachedAccountField) || '[]');
}
