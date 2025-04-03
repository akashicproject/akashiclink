import { IonButton, IonCard, IonCol, IonGrid, IonRow } from '@ionic/react';

import type { Wallet } from '../constants/dummy-data';

export function SendTable({
  keyWallets,
  onClick,
}: {
  keyAddress: string;
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
                disabled={!w.balance || w.balance === '0'}
              >
                Send
              </IonButton>
            </IonCol>
          </IonRow>
        ))}
      </IonGrid>
    </IonCard>
  );
}
