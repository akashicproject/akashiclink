import { L2Regex } from '@helium-pay/backend';
import { useContext } from 'react';

import {
  ActiveAccountContext,
  LocalAccountContext,
} from '../../components/PreferenceProvider';

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
  const { localAccounts, setLocalAccounts } = useContext(LocalAccountContext);
  const { activeAccount, setActiveAccount } = useContext(ActiveAccountContext);

  const addPrefixToAccounts = async () => {
    if (localAccounts.some((acc) => !L2Regex.exec(acc.identity))) {
      const accountsWithPrefix = localAccounts.map((acc) => ({
        ...acc,
        identity: L2Regex.exec(acc.identity)
          ? acc.identity
          : 'AS' + acc.identity,
      }));
      setLocalAccounts(accountsWithPrefix);
    }
  };

  const addLocalAccount = async (account: LocalAccount) => {
    // Skip duplicate accounts
    for (const { username } of localAccounts ?? [])
      if (username === account.username) return;

    await setLocalAccounts([...(localAccounts ?? []), account]);
  };

  const removeLocalAccount = async (account: LocalAccount) => {
    const accsToKeep = localAccounts.reduce((p, c) => {
      if (c.identity !== account.identity) {
        p.push(c);
      }
      return p;
    }, [] as LocalAccount[]);

    await setLocalAccounts(accsToKeep);
  };

  const clearActiveAccount = async () => {
    await setActiveAccount(null);
  };

  return {
    localAccounts,
    addLocalAccount,
    removeLocalAccount,
    addPrefixToAccounts,
    activeAccount,
    setActiveAccount,
    clearActiveAccount,
  };
};
