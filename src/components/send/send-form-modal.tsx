import {
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { type RefObject, useContext } from 'react';

import { SendChooseCurrencyForm } from './send-choose-currency-form/send-choose-currency-form';
import { SendConfirmationForm } from './send-confirmation-form/send-confirmation-form';
import { SendForm } from './send-form/send-form';
import { SendFormContext } from './send-form-trigger-button';

export function SendFormModal({
  modal,
}: {
  modal: RefObject<HTMLIonModalElement>;
}) {
  const {
    isModalOpen,
    setIsModalOpen,
    isModalLock,
    step,
    setStep,
    sendConfirm,
    setSendConfirm,
  } = useContext(SendFormContext);

  return (
    <IonModal
      handle={!isModalLock}
      ref={modal}
      initialBreakpoint={0.92}
      breakpoints={[0, 0.92]}
      isOpen={isModalOpen}
      canDismiss={!isModalLock}
      onIonModalDidDismiss={() => {
        setStep(0);
        setSendConfirm(undefined);
        setIsModalOpen(false);
      }}
      style={{
        '--border-radius': '24px',
      }}
    >
      <IonContent>
        <IonGrid>
          <IonRow className={'ion-grid-row-gap-sm ion-grid-column-gap-xxs'}>
            {!isModalLock && step !== 0 && !sendConfirm?.txnFinal && (
              <IonButton
                onClick={() => setStep(step - 1)}
                className="close-button"
                fill="clear"
                style={{
                  color: 'var(--ion-color-grey)',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  zIndex: 1000,
                }}
              >
                <IonIcon
                  icon={arrowBackOutline}
                  className={'ion-text-size-xl'}
                />
              </IonButton>
            )}
          </IonRow>
        </IonGrid>
        {step === 0 && <SendChooseCurrencyForm />}
        {step === 1 && <SendForm />}
        {step === 2 && <SendConfirmationForm />}
      </IonContent>
    </IonModal>
  );
}
