import '../pages/common.css';

import { NetworkDictionary } from '@helium-pay/backend/src/modules/api-interfaces/networks/networks.model';
import type { ITransactionRecordResponse } from '@helium-pay/backend/src/modules/api-interfaces/transactions/transaction-records.interface';
import { TransactionStatus } from '@helium-pay/backend/src/modules/keys/models/transaction-status.model';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';

export function TransactionSummary({
  txn,
  onBack,
}: {
  txn: ITransactionRecordResponse;
  onBack: () => void;
}) {
  const url = `${NetworkDictionary[txn.coinSymbol].txnUrl}/${txn.txHash}`;

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButton onClick={onBack}>
            <IonIcon icon={arrowBackOutline} slot="start" />
          </IonButton>
          <IonTitle>Transaction Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Status</IonLabel>
            <IonText
              className={
                txn.status === TransactionStatus.PENDING
                  ? 'ion-text-warning'
                  : txn.status === TransactionStatus.CONFIRMED
                  ? 'ion-text-success'
                  : 'ion-text-danger'
              }
            >
              {txn.status}
            </IonText>
          </IonItem>
          <IonItem>
            <IonLabel>URL</IonLabel>
            <IonLabel className="ion-text-end">{url}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>From</IonLabel>
            <IonLabel className="ion-text-end">
              <IonIcon icon={arrowBackOutline} slot="start" />
              {txn.senderAddress}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>To</IonLabel>
            <IonLabel className="ion-text-end">
              <IonIcon icon={arrowBackOutline} slot="start" />
              {txn.recipientAddress}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Amount</IonLabel>
            <IonLabel className="ion-text-end">{`${txn.amount} ${
              txn.tokenSymbol ?? txn.coinSymbol
            }`}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Gas</IonLabel>
            <IonLabel className="ion-text-end">
              {txn.feesPaid || 0} {txn.coinSymbol}
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </>
  );
}
