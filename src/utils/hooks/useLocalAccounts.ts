import { type CoinSymbol, L2Regex, OtkType } from '@helium-pay/backend';
import crypto from 'crypto';

import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  selectActiveAccount,
  selectCacheOtk,
  selectLocalAccounts,
  setActiveAccount as setActiveAccountState,
  setCacheOtk as setCacheOtkState,
  setLocalAccounts,
} from '../../redux/slices/accountSlice';
import { getAccountUniqueId, isSameAccount } from '../account';
import { ChainAPI } from '../chain-api';
import type { FullOtk } from '../otk-generation';
import { useSecureStorage } from './useSecureStorage';

// TODO this is vulnerable to padding oracle attacks. CBC should be replaced
//  with GCM (or similar), but we'll need to be careful about backwards
//  compatibility. https://sonarsource.atlassian.net/browse/RSPEC-5542
const algorithm = 'aes-256-cbc';
const secretIv = process.env.REACT_APP_SECRETIV ?? '6RxIESTJ1eJLpjpe';

export interface LocalAccount {
  identity: string;
  username?: string;
  alias?: string;
  accountName?: string;
  ledgerId?: string; // aas nft ledferId to display the image
  otkType?: OtkType;
  localStoredL1Addresses?: LocalStoredL1AddressType[];
}
export type LocalStoredL1AddressType = {
  coinSymbol: CoinSymbol;
  address: string;
};
/**
 * Storage and lookup of a users:
 * - activeAccount: session account set when user is logged in
 * - localAccounts: available accounts that user has imported
 */
export const useAccountStorage = () => {
  // Because of migrating from local storages to redux and wanting to keep the
  // data, we fetch localStorage accounts and tack them on what is stored in
  // redux, after filtering out duplicates
  // Similarly for active account
  // TODO: Delete the legacy-stuff when backwards-compatibility to local storage
  // no longer necessary
  const dispatch = useAppDispatch();
  const { getItem, setItem, removeItem } = useSecureStorage();

  const storedLocalAccounts = useAppSelector(selectLocalAccounts);

  const localAccounts = Object.values(
    [...storedLocalAccounts].reduce(
      (acc, next) => {
        next.identity && (acc[getAccountUniqueId(next)] = next);
        return acc;
      },
      {} as Record<string, LocalAccount>
    )
  );

  const cacheOtk = useAppSelector(selectCacheOtk);

  const activeAccount = useAppSelector(selectActiveAccount);

  const addPrefixToAccounts = async () => {
    if (localAccounts.some((acc) => !L2Regex.exec(acc.identity))) {
      const accountsWithPrefix = localAccounts.map((acc) => ({
        ...acc,
        identity: L2Regex.exec(acc.identity)
          ? acc.identity
          : 'AS' + acc.identity,
      }));
      dispatch(setLocalAccounts(accountsWithPrefix));
    }
  };

  const addAasToAccountByIdentity = async ({
    identity,
    otkType,
    alias,
    ledgerId,
  }: {
    identity: string;
    otkType?: OtkType;
    alias: string;
    ledgerId: string;
  }) => {
    const updatedAccounts = localAccounts.map((localAccount) => {
      return isSameAccount(localAccount, { identity, otkType })
        ? { ...localAccount, alias, ledgerId }
        : localAccount;
    });
    dispatch(setLocalAccounts(updatedAccounts));

    // also update the activeAccount if it is currently active
    if (activeAccount && isSameAccount(activeAccount, { identity, otkType })) {
      dispatch(
        setActiveAccountState({
          ...activeAccount,
          alias,
          ledgerId,
        })
      );
    }
  };

  const removeAasFromAccountByIdentity = async ({
    identity,
    otkType,
  }: {
    identity: string;
    otkType?: OtkType;
  }) => {
    const updatedAccounts = localAccounts.map((l) => {
      if (isSameAccount(l, { identity, otkType })) {
        const { alias: _, ledgerId: _a, ...rest } = l;
        return rest;
      }
      return l;
    });
    dispatch(setLocalAccounts(updatedAccounts));

    if (activeAccount && isSameAccount(activeAccount, { identity, otkType })) {
      dispatch(
        setActiveAccountState({
          ...activeAccount,
          alias: undefined,
          ledgerId: undefined,
        })
      );
    }
  };

  const addLocalAccount = async (newAccount: LocalAccount) => {
    // Skip duplicate accounts if it already exists locally
    for (const { identity, otkType } of localAccounts ?? []) {
      if (isSameAccount(newAccount, { identity, otkType })) return;
    }
    dispatch(setLocalAccounts([...(localAccounts ?? []), newAccount]));
  };

  const removeLocalAccount = async (targetAccount: LocalAccount) => {
    const accountsToKeep = localAccounts.filter(
      (localAccount) => !isSameAccount(localAccount, targetAccount)
    );
    dispatch(setLocalAccounts(accountsToKeep));

    await removeLocalOtk(getAccountUniqueId(targetAccount));
  };

  const updateLocalAccount = async (
    targetAccount: LocalAccount,
    newAccount: LocalAccount
  ) => {
    // replace the targetAccount with the new account
    const newAccountList = localAccounts.map((localAccount) => {
      return isSameAccount(localAccount, targetAccount)
        ? newAccount
        : localAccount;
    });

    dispatch(setLocalAccounts(newAccountList));
  };

  const clearActiveAccount = async () => {
    dispatch(setActiveAccountState(null));
  };

  const getLocalOtk = async ({
    identity,
    otkType,
    password,
  }: {
    identity: string;
    otkType?: OtkType;
    password: string;
  }): Promise<FullOtk | undefined> => {
    const encryptedOtk = await getItem(
      getAccountUniqueId({ identity, otkType })
    );

    if (!encryptedOtk) {
      return undefined;
    }

    const encryptedOtkBuff = Buffer.from(encryptedOtk, 'base64');
    const key = genKeyFromPassword(password);
    const decipher = crypto.createDecipheriv(algorithm, key, secretIv);
    return JSON.parse(
      decipher.update(encryptedOtkBuff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
    ) as FullOtk;
  };

  const getLocalOtkAndCache = async ({
    identity,
    otkType,
    password,
  }: {
    identity: string;
    otkType?: OtkType;
    password: string;
  }): Promise<FullOtk | undefined> => {
    const otk = await getLocalOtk({ identity, otkType, password });

    if (otk) {
      dispatch(setCacheOtkState(otk));

      if (!!otkType) {
        return otk;
      }

      // if the account is missing otkType
      // step 1: check chain for the otkType of this otk
      const { authorities } = await ChainAPI.findIdentityStream({
        identity,
      });

      if (!authorities) {
        return otk;
      }

      const authority = authorities.find(
        (authority) => authority.public === otk?.key.pub.pkcs8pem
      );

      // step 2: if info is found, duplicate a new account using the otk & otkType
      if (!!authority) {
        const accountOtkType = authority.label ?? OtkType.PRIMARY; //its primary if chain return empty
        await addLocalOtk({
          otk,
          password,
          otkType: accountOtkType,
        });
        // add new account and remove old account in one single dispatch
        // !! using addLocalAccount + removeLocalAccount would NOT work
        await updateLocalAccount(
          { identity, otkType: undefined },
          { identity, otkType: accountOtkType }
        );
        setActiveAccount({ identity, otkType: accountOtkType });
      }
      return otk;
    } else {
      return undefined;
    }
  };

  const addLocalOtk = async ({
    otk,
    otkType,
    password,
  }: {
    otk: FullOtk;
    otkType?: OtkType;
    password: string;
  }) => {
    const key = genKeyFromPassword(password);
    // eslint-disable-next-line sonarjs/encryption-secure-mode
    const cipher = crypto.createCipheriv(algorithm, key, secretIv);
    const encryptedOtk = Buffer.from(
      cipher.update(JSON.stringify(otk), 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');

    await setItem(
      getAccountUniqueId({ identity: otk.identity, otkType }),
      encryptedOtk
    );
  };

  const addLocalOtkAndCache = async ({
    otk,
    password,
    otkType,
  }: {
    otk: FullOtk;
    password: string;
    otkType?: OtkType;
  }) => {
    await addLocalOtk({ otk, otkType, password });
    dispatch(setCacheOtkState(otk));
  };

  const changeOtkPassword = async ({
    identity,
    otkType,
    oldPassword,
    newPassword,
  }: {
    identity: string;
    otkType?: OtkType;
    oldPassword: string;
    newPassword: string;
  }) => {
    const otk = await getLocalOtk({ identity, otkType, password: oldPassword });
    if (otk) {
      await addLocalOtk({ otk, otkType, password: newPassword });
    }
  };

  const removeLocalOtk = async (accountUniqueId: string) => {
    await removeItem(accountUniqueId);

    dispatch(setCacheOtkState(null));
  };

  // key min length is 32 byte
  const genKeyFromPassword = (password: string) => {
    return crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')
      .substring(0, 32);
  };

  const localAccountsWithName: LocalAccount[] = localAccounts.map(
    (account) => ({
      ...account,
      accountName: `Account ${account.identity.slice(-8)}`,
    })
  );

  const setActiveAccount = (account: LocalAccount) => {
    dispatch(
      setActiveAccountState({
        ...account,
        accountName: `Account ${account.identity.slice(-8)}`,
      })
    );
  };

  const setCacheOtk = (otk: FullOtk | null) => {
    dispatch(setCacheOtkState(otk));
  };

  const setLocalStoredL1Addresses = ({
    identity,
    otkType,
    newL1Addresses,
  }: {
    identity: string;
    otkType?: OtkType;
    newL1Addresses: LocalStoredL1AddressType[];
  }) => {
    if (newL1Addresses.length === 0) return;

    const updatedAccounts = localAccounts.map((l) => {
      return isSameAccount(l, { identity, otkType })
        ? {
            ...l,
            localStoredL1Addresses: newL1Addresses,
          }
        : l;
    });

    dispatch(setLocalAccounts(updatedAccounts));

    // also update active account copy
    if (activeAccount && isSameAccount(activeAccount, { identity, otkType })) {
      dispatch(
        setActiveAccountState({
          ...activeAccount,
          localStoredL1Addresses: newL1Addresses,
        })
      );
    }
  };

  return {
    localAccounts: localAccountsWithName,
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
    addAasToAccountByIdentity,
    removeAasFromAccountByIdentity,
    cacheOtk,
    authenticated: !!cacheOtk,
    setCacheOtk,
    setLocalStoredL1Addresses,
  };
};
