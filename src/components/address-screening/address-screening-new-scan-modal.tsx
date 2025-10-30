import {
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useMemo,
  useState,
} from 'react';

import { AddressScreeningConfirmationForm } from './address-screening-confirmation-form';
import { AddressScreeningForm } from './address-screening-form';
import type { AddressScanConfirmationTxnsDetail } from './types';

export const AddressScreeningContext = createContext<{
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  addressScanConfirm?: AddressScanConfirmationTxnsDetail;
  setAddressScanConfirm: Dispatch<
    SetStateAction<AddressScanConfirmationTxnsDetail | undefined>
  >;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}>({
  step: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setStep: () => {},
  addressScanConfirm: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAddressScanConfirm: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsModalOpen: () => {},
});

export function AddressScreeningNewScanModal({
  modal,
  isOpen,
  setIsOpen,
}: {
  modal: RefObject<HTMLIonModalElement>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [step, setStep] = useState(0);
  const [addressScanConfirm, setAddressScanConfirm] = useState<
    AddressScanConfirmationTxnsDetail | undefined
  >(undefined);

  const contextValue = useMemo(
    () => ({
      step,
      setStep,
      addressScanConfirm,
      setAddressScanConfirm,
      setIsModalOpen: setIsOpen,
    }),
    [step]
  );

  return (
    <IonModal
      handle={true}
      ref={modal}
      initialBreakpoint={0.91}
      breakpoints={[0, 0.91]}
      isOpen={isOpen}
      onIonModalDidDismiss={() => {
        setStep(0);
        setIsOpen(false);
      }}
      style={{
        '--border-radius': '24px',
      }}
    >
      <IonContent>
        <IonGrid>
          <IonRow className={'ion-grid-row-gap-sm ion-grid-column-gap-xxs'}>
            <IonButton
              size="small"
              onClick={() => setIsOpen(false)}
              className="close-button"
              fill="clear"
              style={{
                color: 'var(--ion-color-grey)',
                position: 'absolute',
                top: '0',
                right: '0',
                zIndex: 1000,
              }}
            >
              <IonIcon icon={closeOutline} className={'ion-text-size-xxl'} />
            </IonButton>
          </IonRow>
        </IonGrid>
        <AddressScreeningContext.Provider value={contextValue}>
          {step === 0 && <AddressScreeningForm />}
          {step === 1 && <AddressScreeningConfirmationForm />}
        </AddressScreeningContext.Provider>
      </IonContent>
    </IonModal>
  );
}
