import { Preferences } from '@capacitor/preferences';
import type { IonButton } from '@ionic/react';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { WhiteButton } from '../components/buttons';
import { urls } from '../constants/urls';

const LastPageStorage = 'last-page';
const LastPageVarsStorage = 'last-page-vars';
// Expire last page after 3 mins to improve security
const expiredTime = 3 * 60 * 1000;

/**
 * Store and retrieve the last page user was on before clicking
 * "outside" the extension which automatically minimises it.
 * @param lastPage url to redirect to when user clicks back into application
 * @param lastPageVars to load in the context of the redirected page
 */
export const lastPageStorage = {
  store: async (
    lastPage: typeof urls[keyof typeof urls],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastPageVars: any = {}
  ): Promise<void> => {
    const expiry = new Date(Date.now() + expiredTime);
    const lastPageObj = {
      url: lastPage,
      expiredTime: expiry,
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
  get: async (): Promise<string | null> => {
    const { value } = await Preferences.get({ key: LastPageStorage });
    const lastPageObj = JSON.parse(value || '{}');
    if (Object.keys(lastPageObj).length === 0) {
      return null;
    }
    const now = new Date();
    const expiry = new Date(lastPageObj.expiredTime);
    if (now > expiry) {
      await Preferences.remove({ key: LastPageStorage });
      return urls.akashicPay;
    }
    return lastPageObj.url;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getVars: async (): Promise<any> => {
    const { value } = await Preferences.get({ key: LastPageVarsStorage });
    return JSON.parse(value || '{}');
  },
};

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
