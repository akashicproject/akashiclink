import { IonButton, IonContent, IonIcon, IonModal } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { type RefObject, useContext } from 'react';

import { DashboardPreferenceCurrencyFilter } from './dashboard-preference-currency-filter';
import { DashboardPreferenceContext } from './dashboard-preference-modal-trigger-button';
import { DashboardPreferenceSaveButtons } from './dashboard-preference-save-buttons';
import { DashboardPreferenceSorting } from './dashboard-preference-sorting';

export function DashboardPreferenceModal({
  modal,
}: {
  modal: RefObject<HTMLIonModalElement>;
}) {
  const { isModalOpen, setIsModalOpen, step, setStep } = useContext(
    DashboardPreferenceContext
  );

  const onIonModalDidDismiss = () => {
    setStep(0);
    setIsModalOpen(false);
  };

  return (
    <IonModal
      ref={modal}
      initialBreakpoint={0.7}
      breakpoints={[0, 0.7]}
      isOpen={isModalOpen}
      onIonModalDidDismiss={onIonModalDidDismiss}
      style={{
        '--border-radius': '24px',
      }}
    >
      {step !== 0 && (
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
          <IonIcon icon={arrowBackOutline} className={'ion-text-size-xl'} />
        </IonButton>
      )}
      <IonContent className="ion-padding-top-xl">
        <div style={{ height: '52vh' }}>
          {step === 0 && <DashboardPreferenceSorting />}
          {step === 1 && <DashboardPreferenceCurrencyFilter />}
        </div>
        <DashboardPreferenceSaveButtons />
      </IonContent>
    </IonModal>
  );
}
