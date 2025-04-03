import { useLocalStorage } from './useLocalStorage';

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
 * Storage and lookup of a users:
 * - activeAccount: session account set when user is logged in
 * - localAccounts: available accounts that user has imported
 */
export const useAccountStorage = () => {
  const LocalAccountStorage = 'cached-accounts';
  const [localAccounts, setLocalAccounts, _] = useLocalStorage<LocalAccount[]>(
    LocalAccountStorage,
    []
  );
  const addLocalAccount = (account: LocalAccount) => {
    // Skip duplicate accounts
    for (const { identity, username } of localAccounts)
      if (identity === account.identity && username === account.username)
        return;

    setLocalAccounts([...localAccounts, account]);
  };

  const SessionAccount = 'session-account';
  const [activeAccount, setActiveAccount] =
    useLocalStorage<LocalAccount | null>(SessionAccount, null);
  const clearActiveAccount = (): void => {
    setActiveAccount(null);
  };

  return {
    localAccounts,
    addLocalAccount,
    activeAccount,
    setActiveAccount,
    clearActiveAccount,
  };
};
