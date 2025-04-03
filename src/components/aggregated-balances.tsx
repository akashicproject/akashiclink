import { IonButton, IonCard, IonCol, IonGrid, IonRow } from '@ionic/react';

import type { UserWallet } from '../utils/supported-currencies';

export function AggregatedBalances({
  keyWallets,
  onClick,
}: {
  keyWallets: UserWallet[];
  onClick: (wallet: UserWallet) => void;
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
