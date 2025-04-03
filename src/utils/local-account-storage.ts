const LocalAccountStorage = 'cached-account';

/**
 * When logging in, a user will select a wallet `identity`
 * This is translated to a `username` that is sent with the `password`
 * to the /login endpoint
 */
export interface LocalAccount {
  identity: string;
  username: string;
}

/**
 * Store a username-identity pair in a local storage list
 */
export function storeLocalAccount(account: LocalAccount) {
  const cachedAccounts = JSON.parse(
    localStorage.getItem(LocalAccountStorage) || '[]'
  ) as LocalAccount[];

  // Do not add duplicate accounts
  for (const { identity, username } of cachedAccounts) {
    if (identity === account.identity && username === account.username) return;
  }

  localStorage.setItem(
    LocalAccountStorage,
    JSON.stringify([
      ...cachedAccounts,
      {
        identity: account.identity || 'undefined',
        username: account.username,
      },
    ])
  );
}

export function getLocalAccounts(): LocalAccount[] {
  return JSON.parse(localStorage.getItem(LocalAccountStorage) || '[]');
}
