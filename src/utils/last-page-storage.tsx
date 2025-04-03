import { IonButton, IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';

import type { urls } from '../constants/urls';

const LastPageStorage = 'last-page';

/**
 * Store and retriebve the last page user was on before clicking "outside" the
 * extension which automatically minimises it.
 */
export const lastPageStorage = {
  store: (lastPage: typeof urls[keyof typeof urls]): void =>
    localStorage.setItem(LastPageStorage, lastPage),
  clear: (): void => localStorage.removeItem(LastPageStorage),
  get: (): string | null => localStorage.getItem(LastPageStorage),
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
