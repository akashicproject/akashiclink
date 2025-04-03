import { useLocalStorage } from './hooks/useLocalStorage';

/** Tag under which local accounts are stored in local storage */
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
  const [accounts, setAccounts] = useLocalStorage(
    LocalAccountStorage,
    [] as LocalAccount[]
  );
  // Do not add duplicate accounts
  if (
    accounts.every(
      ({ identity, username }) =>
        identity !== account.identity || username !== account.username
    )
  ) {
    setAccounts([
      ...accounts,
      {
        identity: account.identity || 'undefined',
        username: account.username,
      },
    ]);
  }
}

export function getLocalAccounts(): LocalAccount[] {
  const [accounts, _] = useLocalStorage(
    LocalAccountStorage,
    [] as LocalAccount[]
  );
  return accounts;
}
