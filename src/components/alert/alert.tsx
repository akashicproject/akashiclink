import './alert.scss';

import {
  IonAlert,
  IonButton,
  IonButtons,
  IonIcon,
  IonImg,
  IonModal,
  IonNote,
  IonText,
  IonToolbar,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../buttons';

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

export interface CustomAlertState {
  visible: boolean;
  success: boolean;
  message: string;
  onConfirm?: () => void;
  confirmButtonMessage?: string;
}

/**
 * Popup alert featuring
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

  /** Monitors key presses to dismiss alert on ENTER */
  const handleKeyPress = (event: KeyboardEvent) =>
    event.key === 'Enter' && setState(formAlertResetState);
  return (
    <IonAlert
      isOpen={state.visible}
      header={state.success ? `${t('Success')}` : `${t('Failure')}`}
      message={state.message}
      buttons={['OK']}
      /* Listen for keydown events once rendered - stop once closed */
      onDidPresent={() => {
        document.addEventListener('keydown', handleKeyPress);
      }}
      onDidDismiss={() => {
        document.removeEventListener('keydown', handleKeyPress);
        setState(formAlertResetState);
      }}
    />
  );
}

/**
 * Popup alert with custom design featuring
 * - title
 * - message
 * - visibility state
 * - Optional button (e.g. to redirect somewhere)
 */
export function CustomAlert({ state }: { state: CustomAlertState }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(state.visible);

  /**
   * Respond to changes in the externally supplied state
   */
  useEffect(() => setIsOpen(state.visible), [state]);

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={() => setIsOpen(false)}
      className="custom-alert"
    >
      <IonToolbar color="#ffffff">
        <IonButtons slot="end">
          <IonButton onClick={() => setIsOpen(false)}>
            <IonIcon
              className="icon-button-icon"
              slot="icon-only"
              icon={closeOutline}
            />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <div className="warning">
        <IonImg
          alt={''}
          src={'/shared-assets/images/error-outline.png'}
          style={{ width: '48px', height: '48px' }}
        />
        <IonText className="warning-text">
          <h2>{state.success ? `${t('Success')}` : `${t('Failure')}`}</h2>
          {state.message}
        </IonText>
        {state.onConfirm && (
          <PurpleButton onClick={state.onConfirm} style={{ width: '160px' }}>
            {state.confirmButtonMessage ?? t('Confirm')}
          </PurpleButton>
        )}
      </div>
    </IonModal>
  );
}

/**
 * Boxed Alert featuring
 * - message
 * - visibility state
 */
export function AlertBox({
  state,
  style,
}: {
  state: FormAlertState;
  style?: React.CSSProperties;
}) {
  const color = state.success
    ? 'var(--ion-color-success)'
    : 'var(--ion-color-danger)';

  return (
    <IonNote
      style={{
        ...(state.visible && {
          border: `1px solid ${style?.color || color}`,
        }),
      }}
    >
      <h4
        style={{
          marginTop: '5px',
          marginBottom: '5px',
          color,
          ...style,
        }}
      >
        {state.message}
      </h4>
    </IonNote>
  );
}
