import { Preferences } from '@capacitor/preferences';
import type { IonButton } from '@ionic/react';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { WhiteButton } from '../components/buttons';
import type { Url } from '../constants/urls';
import { urls } from '../constants/urls';

const LastPageStorage = 'last-page';
const LastPageVarsStorage = 'last-page-vars';
// Expire last page after 3 mins to improve security
const expiredTime = 3 * 60 * 1000;

/**
 * NavigationPriority indicates if the last page user was on, should be redirected
 * to immediately, or await until authentication (valid cookie) has passed
 *
 * e.g. CreatingAccount page should always take priority, irrespective of login status
 * e.g. The dashboard showing user information, should only be redirect to after authentication has passed
 */
export enum NavigationPriority {
  IMMEDIATE = 'IMMEDIATE',
  AWAIT_AUTHENTICATION = 'AWAIT_AUTHENTICATION',
}

/**
 * Store and retrieve the last page user was on
 * This data is used when user returns to a session
 *
 * @param lastPage url to redirect to when user clicks back into application
 * @param lastPageVars to load in the context of the redirected page
 * @param navigationPriority see `NavigationPriority`
 */
export const lastPageStorage = {
  store: async (
    lastPage: Url,
    navigationPriority: NavigationPriority = NavigationPriority.AWAIT_AUTHENTICATION,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastPageVars: any = {}
  ): Promise<void> => {
    const expiry = new Date(Date.now() + expiredTime);
    const lastPageObj = {
      url: lastPage,
      expiredTime: expiry,
      navigationPriority,
    };
    await Preferences.set({
      key: LastPageStorage,
      value: JSON.stringify(lastPageObj),
    });
    await Preferences.set({
      key: LastPageVarsStorage,
      value: JSON.stringify(lastPageVars),
    });
  },
  clear: async (): Promise<void> => {
    await Preferences.remove({ key: LastPageStorage });
    await Preferences.remove({ key: LastPageVarsStorage });
  },
  get: async (): Promise<{
    lastPageUrl: typeof urls[keyof typeof urls];
    navigationPriority: NavigationPriority;
  } | null> => {
    const { value } = await Preferences.get({ key: LastPageStorage });
    const lastPageObj = JSON.parse(value || '{}');
    if (Object.keys(lastPageObj).length === 0) {
      return null;
    }
    const now = new Date();
    const expiry = new Date(lastPageObj.expiredTime);
    if (now > expiry) {
      await Preferences.remove({ key: LastPageStorage });
      await Preferences.remove({ key: LastPageVarsStorage });
      return {
        lastPageUrl: urls.akashicPay,
        navigationPriority: NavigationPriority.AWAIT_AUTHENTICATION,
      };
    }
    return {
      lastPageUrl: lastPageObj.url,
      navigationPriority: lastPageObj.navigationPriority,
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getVars: async (): Promise<any> => {
    const { value } = await Preferences.get({ key: LastPageVarsStorage });
    return JSON.parse(value || '{}');
  },
};

/**
 * Call this method in useEffect, to store the current page in memory
 *
 * @param currentPageUrl to store
 * @param navigationPriority when resuming session
 * @param onResume - callback if current page is already in memory
 */
export async function cacheCurrentPage(
  currentPageUrl: Url,
  navigationPriority?: NavigationPriority,
  onResume?: () => Promise<void>
) {
  const lastPage = await lastPageStorage.get();

  if (lastPage && lastPage.lastPageUrl === currentPageUrl && onResume)
    onResume();
  else lastPageStorage.store(currentPageUrl, navigationPriority);
}

/**
 * Button drops all local storage variables - they keep track
 * of a users progress through a "flow" such as creating an account
 *
 * @param callback to trigger alongside the clearing operation
 */
export function ResetPageButton({
  callback,
  ...props
}: { callback?: () => void } & ComponentProps<typeof IonButton>) {
  const { t } = useTranslation();

  return (
    <WhiteButton
      {...props}
      fill="clear"
      onClick={async () => {
        await lastPageStorage.clear();
        if (callback) callback();
      }}
    >
      {t('Cancel')}
    </WhiteButton>
  );
}
