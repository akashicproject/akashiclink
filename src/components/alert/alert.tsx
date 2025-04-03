import './alert.css';

import { IonAlert } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @param success for green, red otherwise
 * @param visible if true
 * @param message to display in menu
 */
export interface FormAlertState {
  success: boolean;
  visible: boolean;
  message: string;
}

export const errorAlertShell = (message: string) => ({
  success: false,
  visible: true,
  message,
});

export const successAlertShell = (message: string) => ({
  success: true,
  visible: true,
  message,
});

export const formAlertResetState: FormAlertState = {
  success: false,
  visible: false,
  message: '',
};

/**
 * Alert featuring
 * - title
 * - message
 * - visibility state
 */
export function Alert({ state: externalState }: { state: FormAlertState }) {
  const { t } = useTranslation();
  const [state, setState] = useState(externalState);

  /**
   * Respond to changes in the externally supplied state
   */
  useEffect(() => setState(externalState), [externalState]);

  return (
    <IonAlert
      isOpen={state.visible}
      header={state.success ? `${t('Success')}` : `${t('Failure')}`}
      message={state.message}
      buttons={['OK']}
      onDidDismiss={() => setState(formAlertResetState)}
    />
  );
}
