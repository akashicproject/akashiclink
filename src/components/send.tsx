import '../pages/common.css';

import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonRow,
  IonText,
} from '@ionic/react';
import { helpOutline } from 'ionicons/icons';
import { useState } from 'react';

import type { Wallet } from '../constants/dummy-data';

/**
 * Pending: user filling details out
 * Success
 */
const enum SendState {
  Pending,
  Success,
}

function TransactionRow(item: { label: string; value?: string }) {
  return (
    <IonItem>
      <IonLabel>{item.label}</IonLabel>
      {item.value}
    </IonItem>
  );
}

export function Send({
  wallet,
  onBack,
}: {
  wallet: Wallet;
  onBack: () => void;
}) {
  const [sendState, setSendState] = useState(SendState.Pending);
  const [receiver, setReceiver] = useState<string | undefined>();
  const [amount, setAmount] = useState<string | undefined>();

  return (
    <IonContent>
      {sendState === SendState.Pending && (
        <IonCard style={{ textAlign: 'center' }}>
          <IonCardHeader>
            <IonCardTitle>Transaciton Details</IonCardTitle>
          </IonCardHeader>
          <IonList>
            <IonItem fill="outline">
              <IonLabel position="floating">{wallet.coinSymbol}</IonLabel>
              <IonInput
                placeholder="amount"
                onIonChange={({ detail }) =>
                  setAmount(detail.value || undefined)
                }
              />
            </IonItem>
            <IonItem fill="outline">
              <IonLabel position="floating">Send to</IonLabel>
              <IonInput
                onIonChange={({ detail }) =>
                  setReceiver(detail.value || undefined)
                }
              />
            </IonItem>
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    {wallet.gasFreeAvailable && (
                      <IonText color="success">Gas-free available</IonText>
                    )}
                    {!wallet.gasFreeAvailable && (
                      <IonText color="danger">Gas-free not available</IonText>
                    )}
                  </IonCol>
                  <IonCol>
                    <IonLabel>Fee</IonLabel>
                    <IonText style={{ marginLeft: '10px' }}>0.1%</IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
            {wallet.gasFreeAvailable && (
              <IonItem>
                <IonCheckbox slot="start"></IonCheckbox>
                <IonLabel>Gas free transaction</IonLabel>
                <IonButton id="gas-free-help">
                  <IonIcon slot="icon-only" icon={helpOutline}></IonIcon>
                </IonButton>
                <IonPopover trigger="gas-free-help" triggerAction="hover">
                  <IonContent class="ion-padding">
                    Nitr0gen wallet can execute gas-free transactions
                  </IonContent>
                </IonPopover>
              </IonItem>
            )}
          </IonList>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton onClick={onBack}>Cancel</IonButton>
              </IonCol>
              <IonCol>
                <IonButton onClick={() => setSendState(SendState.Success)}>
                  Send
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
      )}
      {sendState === SendState.Success && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Transaction Successful!</IonCardTitle>
          </IonCardHeader>
          <IonList>
            <TransactionRow label="Sender" value={wallet.address} />
            <TransactionRow label="Receiver" value={receiver} />
            <TransactionRow label="Amount" value={amount} />
            <TransactionRow label="Gas" value="0" />
            <TransactionRow label="TXID" value="xxx" />
            <TransactionRow label="Fee" value="0" />
          </IonList>
          <IonButton onClick={onBack}>Confirm</IonButton>
        </IonCard>
      )}
    </IonContent>
  );
}
