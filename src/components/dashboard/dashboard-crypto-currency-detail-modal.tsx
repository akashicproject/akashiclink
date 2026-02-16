import { type CryptoCurrencyWithName } from '@akashic/as-backend';
import {
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useState,
} from 'react';

import { CurrencyQrCodeAddress } from '../deposit/currency-qr-code-address';
import { DashboardCryptoCurrencyDetail } from './dashboard-crypto-currency-detail';

export function DashboardCryptoCurrencyDetailModal({
  isModalOpen,
  setIsModalOpen,
  modalRef,
  walletCurrency,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  modalRef: RefObject<HTMLIonModalElement>;
  walletCurrency?: CryptoCurrencyWithName;
}) {
  const [step, setStep] = useState(0);

  const onIonModalDidDismiss = () => {
    setIsModalOpen(false);
    setStep(0);
  };

  if (!walletCurrency) return null;

  return (
    <IonModal
      ref={modalRef}
      initialBreakpoint={0.95}
      breakpoints={[0, 0.95]}
      isOpen={isModalOpen}
      onIonModalDidDismiss={onIonModalDidDismiss}
      style={{
        '--border-radius': '24px',
      }}
    >
      <IonContent className="ion-padding-top-xl" scrollY={false}>
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
        {step === 0 && (
          <DashboardCryptoCurrencyDetail
            walletCurrency={walletCurrency}
            setIsModalOpen={setIsModalOpen}
            setStep={setStep}
          />
        )}
        {step === 1 && (
          <CurrencyQrCodeAddress chain={walletCurrency.coinSymbol} />
        )}
      </IonContent>
    </IonModal>
  );
}
