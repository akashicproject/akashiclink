import { IonButton, IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';

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
  store: (
    lastPage: typeof urls[keyof typeof urls],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastPageVars: any = {}
  ): void => {
    const expiry = new Date(Date.now() + expiredTime);
    const lastPageObj = {
      url: lastPage,
      expiredTime: expiry,
    };
    localStorage.setItem(LastPageStorage, JSON.stringify(lastPageObj));
    localStorage.setItem(LastPageVarsStorage, JSON.stringify(lastPageVars));
  },
  clear: (): void => {
    localStorage.removeItem(LastPageStorage);
    localStorage.removeItem(LastPageVarsStorage);
  },
  get: (): string | null => {
    const lastPageObj = JSON.parse(
      localStorage.getItem(LastPageStorage) || '{}'
    );
    if (Object.keys(lastPageObj).length === 0) {
      return null;
    }
    const now = new Date();
    const expiry = new Date(lastPageObj.expiredTime);
    if (now > expiry) {
      localStorage.removeItem(LastPageStorage);
      return urls.akashicPay;
    }
    return lastPageObj.url;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getVars: (): any =>
    JSON.parse(localStorage.getItem(LastPageVarsStorage) || '{}'),
};

export function ResetPageButton({ callback }: { callback?: () => void }) {
  return (
    <IonButton
      fill="clear"
      onClick={() => {
        lastPageStorage.clear();
        if (callback) callback();
      }}
    >
      <IonIcon icon={closeCircleOutline} />
    </IonButton>
  );
}
