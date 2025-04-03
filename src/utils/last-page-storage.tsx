import { IonButton, IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';

import type { urls } from '../constants/urls';

const LastPageStorage = 'last-page';
const LastPageVarsStorage = 'last-page-vars';

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
    localStorage.setItem(LastPageStorage, lastPage);
    localStorage.setItem(LastPageVarsStorage, JSON.stringify(lastPageVars));
  },
  clear: (): void => {
    localStorage.removeItem(LastPageStorage);
    localStorage.removeItem(LastPageVarsStorage);
  },
  get: (): string | null => localStorage.getItem(LastPageStorage),
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
