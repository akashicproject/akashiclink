import '../pages/common.css';

import type { ITransactionRecord } from '@helium-pay/backend/src/modules/api-interfaces/transactions/transaction-records.interface';
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonRow,
  IonText,
} from '@ionic/react';
import { useState } from 'react';

import { txns } from '../constants/dummy-data';
import { TransactionSummary } from './transaction-summary';

enum TxnType {
  Send = 'Send',
  Receive = 'Receive',
}

function Transaction({
  txn,
  onClick,
}: {
  txn: ITransactionRecord;
  onClick: () => void;
}) {
  const { date, amount, ownerAddress, fromAddress, coinSymbol, tokenSymbol } =
    txn;
  const txnType = fromAddress === ownerAddress ? TxnType.Send : TxnType.Receive;

  return (
    <IonCard>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonList>
              <IonItem>
                <IonText>{txnType}</IonText>
              </IonItem>
              <IonItem>
                <IonText>{date.toISOString()}</IonText>
              </IonItem>
            </IonList>
          </IonCol>
          <IonCol>
            <IonButton onClick={onClick}>
              {`${txnType === TxnType.Send ? '-' : ''}${amount} ${
                tokenSymbol ?? coinSymbol
              }`}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
}

enum ActivityView {
  AllTxns,
  SingleTxn,
}

export function Activity({
  keyAddress,
  onBack,
}: {
  keyAddress: string;
  onBack: () => void;
}) {
  const transactions = txns[keyAddress];
  const [txn, setTxn] = useState<ITransactionRecord>();
  const [activityView, setActivityView] = useState(ActivityView.AllTxns);

  if (!transactions || transactions.length == 0)
    return <img alt="empty" src="/shared-assets/images/no-data.svg" />;

  return (
    <>
      {activityView === ActivityView.AllTxns && (
        <IonContent class="center">
          <IonList>
            {transactions.map((txn) => (
              <Transaction
                key={txn.txHash}
                txn={txn}
                onClick={() => {
                  setTxn(txn);
                  setActivityView(ActivityView.SingleTxn);
                }}
              />
            ))}
          </IonList>
          <IonButton onClick={onBack}>Back</IonButton>
        </IonContent>
      )}
      {txn && activityView === ActivityView.SingleTxn && (
        <TransactionSummary
          txn={txn}
          onBack={() => setActivityView(ActivityView.AllTxns)}
        />
      )}
    </>
  );
}
