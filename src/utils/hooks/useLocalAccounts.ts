import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { L2Regex } from '@helium-pay/backend';
import crypto from 'crypto';
import { useContext } from 'react';

const algorithm = 'aes-256-cbc';
const secretIv = '6RxIESTJ1eJLpjpe';

import {
  ActiveAccountContext,
  CacheOtkContext,
  LocalAccountContext,
  LocalOtkContext,
} from '../../components/PreferenceProvider';
import type { FullOtk } from '../otk-generation';

/**
 * When logging in, a user will select a wallet `identity`
 * This is translated to a `username` that is sent with the `password`
 * to the /login endpoint
 */
export interface LocalAccount {
  identity: string;
  username?: string;
}

/**
 * Storage and lookup of a users:
 * - activeAccount: session account set when user is logged in
 * - localAccounts: available accounts that user has imported
 */
export const useAccountStorage = () => {
  const { localAccounts, setLocalAccounts } = useContext(LocalAccountContext);
  const { activeAccount, setActiveAccount } = useContext(ActiveAccountContext);
  const { localOtks, setLocalOtks } = useContext(LocalOtkContext);
  const { setCacheOtk } = useContext(CacheOtkContext);

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
    for (const { identity } of localAccounts ?? [])
      if (identity === account.identity) return;

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
    await removeLocalOtk(account.identity);
  };

  const clearActiveAccount = async () => {
    await setActiveAccount(null);
  };

  const getLocalOtk = async (
    identity: string,
    password: string
  ): Promise<FullOtk | undefined> => {
    const encryptedOtk = await SecureStorage.getItem(identity);
    if (encryptedOtk) {
      const encryptedOtkBuff = Buffer.from(encryptedOtk!, 'base64');
      const key = genKeyFromPassword(password);
      const decipher = crypto.createDecipheriv(algorithm, key, secretIv);
      return JSON.parse(
        decipher.update(encryptedOtkBuff.toString('utf8'), 'hex', 'utf8') +
          decipher.final('utf8')
      );
    } else {
      // Legacy
      // get otk from localstorage if not found in keystore
      // once get, set to keystore
      // remove otk from localstorage
      const otk = localOtks.find((l) => l.identity === activeAccount?.identity);
      if (otk) {
        await addLocalOtk(otk, password);
        await removeLocalOtkFromLocalStorage(otk.identity);
        return otk;
      } else {
        return undefined;
      }
    }
  };

  const getLocalOtkAndCache = async (
    identity: string,
    password: string
  ): Promise<FullOtk | undefined> => {
    const otk = await getLocalOtk(identity, password);
    if (otk) {
      setCacheOtk(otk);
      return otk;
    } else {
      return undefined;
    }
  };

  const addLocalOtk = async (otk: FullOtk, password: string) => {
    const key = genKeyFromPassword(password);
    const cipher = crypto.createCipheriv(algorithm, key, secretIv);
    const encryptedOtk = Buffer.from(
      cipher.update(JSON.stringify(otk), 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
    await SecureStorage.setItem(otk.identity!, encryptedOtk);
  };

  const addLocalOtkAndCache = async (otk: FullOtk, password: string) => {
    await addLocalOtk(otk, password);
    setCacheOtk(otk);
  };

  const changeOtkPassword = async (
    identity: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const otk = await getLocalOtk(identity, oldPassword);
    if (otk) {
      await addLocalOtk(otk, newPassword);
    }
  };

  const removeLocalOtk = async (identity: string) => {
    await SecureStorage.removeItem(identity);

    // Legacy
    // remove otk from localstorage
    await removeLocalOtkFromLocalStorage(identity);

    setCacheOtk(null);
  };

  // Legacy
  // remove otk from localstorage
  const removeLocalOtkFromLocalStorage = async (identity: string) => {
    const otksToKeep = localOtks.reduce((p, c) => {
      if (c.identity !== identity) {
        p.push(c);
      }
      return p;
    }, [] as FullOtk[]);
    await setLocalOtks(otksToKeep);
  };

  // key min length is 32 byte
  const genKeyFromPassword = (password: string) => {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')
      .substring(0, 32);
  };

  return {
    localAccounts,
    addLocalAccount,
    removeLocalAccount,
    addPrefixToAccounts,
    activeAccount,
    setActiveAccount,
    clearActiveAccount,
    getLocalOtkAndCache,
    addLocalOtkAndCache,
    removeLocalOtk,
    changeOtkPassword,
    getLocalOtk,
  };
};
