import { IonButton, IonCard, IonCol, IonGrid, IonRow } from '@ionic/react';

import type { Wallet } from '../constants/dummy-data';

export function AggregatedBalances({
  keyWallets,
  onClick,
}: {
  keyWallets: Wallet[];
  onClick: (wallet: Wallet) => void;
}) {
  return (
    <IonCard>
      <IonGrid>
        {keyWallets.map((w) => (
          <IonRow
            key={`${w.coinSymbol}_${w.tokenSymbol ?? ''}`}
            class="ion-align-items-center"
          >
            <IonCol>{`${w.balance || '0'} ${w.coinSymbol}`}</IonCol>
            <IonCol>
              <IonButton
                expand="block"
                onClick={() => onClick(w)}
                fill="outline"
              >
                Deposit
              </IonButton>
            </IonCol>
          </IonRow>
        ))}
      </IonGrid>
    </IonCard>
  );
}
