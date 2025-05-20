import {
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { type RefObject, useContext, useEffect } from 'react';

import { useFetchAndRemapL1Address } from '../../utils/hooks/useFetchAndRemapL1address';
import { ChooseCurrencyList } from './choose-currency-list';
import { CurrencyQrCodeAddress } from './currency-qr-code-address';
import { DepositModalContext } from './deposit-modal-context-provider';

export function DepositModal({
  modal,
}: {
  modal: RefObject<HTMLIonModalElement>;
}) {
  const { isModalOpen, setIsModalOpen, step, setStep } =
    useContext(DepositModalContext);

  const fetchAndRemapL1Address = useFetchAndRemapL1Address();

  useEffect(() => {
    fetchAndRemapL1Address();
  }, [isModalOpen]);

  return (
    <IonModal
      handle
      ref={modal}
      initialBreakpoint={0.75}
      breakpoints={[0, 0.75]}
      isOpen={isModalOpen}
      onIonModalDidDismiss={() => {
        setStep(0);
        setIsModalOpen(false);
      }}
      style={{
        '--border-radius': '24px',
      }}
    >
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className={'ion-grid-row-gap-sm ion-grid-column-gap-xxs'}>
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
                <IonIcon
                  icon={arrowBackOutline}
                  className={'ion-text-size-xl'}
                />
              </IonButton>
            )}
          </IonRow>
        </IonGrid>
        {step === 0 && <ChooseCurrencyList />}
        {step === 1 && <CurrencyQrCodeAddress />}
      </IonContent>
    </IonModal>
  );
}
