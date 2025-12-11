import { type CryptoCurrencyWithName } from '@akashic/as-backend';
import { IonContent, IonModal } from '@ionic/react';
import { type Dispatch, type RefObject, type SetStateAction } from 'react';

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
  const onIonModalDidDismiss = () => {
    setIsModalOpen(false);
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
        <DashboardCryptoCurrencyDetail
          walletCurrency={walletCurrency}
          setIsModalOpen={setIsModalOpen}
        />
      </IonContent>
    </IonModal>
  );
}
