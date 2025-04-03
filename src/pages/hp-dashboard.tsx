import { CoinSymbol } from '@helium-pay/backend/src/modules/api-interfaces/coin-symbol.model';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';

import { Activity } from '../components/activity';
import { AggregatedBalances } from '../components/aggregated-balances';
import { CreateWallet } from '../components/create-wallet';
import { Send } from '../components/send';
import { SendTable } from '../components/send-table';
import { SettingsPopover } from '../components/settings/settings-popover';
import { ViewWallet } from '../components/view-wallet';
import type { Wallet } from '../constants/dummy-data';
import { aggregatedWalletBalances } from '../constants/dummy-data';

/**
 * KeySummary: view of all currencies under a key
 * CreateWallet
 * ViewWallet to commence a deposit
 */
enum DashboardViews {
  KeySummary,
  CreateWallet,
  ViewWallet,
  SendView,
  SendPage,
  Activity,
}

export function HeliumPayDashboard() {
  const keys = Object.keys(aggregatedWalletBalances);

  const [key, setKey] = useState(keys.length > 0 ? keys[0] : undefined);
  const [view, setView] = useState(DashboardViews.KeySummary);
  const [walletFocus, setWalletFocus] = useState<Wallet>({
    coinSymbol: CoinSymbol.Bitcoin,
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Helium Pay Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonList>
                <IonItem>
                  <IonSelect
                    value={key}
                    interface="popover"
                    placeholder="Select wallet"
                    onIonChange={({ detail: { value: key } }) => setKey(key)}
                  >
                    {keys.map((k) => (
                      <IonSelectOption key={k} value={k}>
                        {k}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonList>
            </IonCol>
            <IonCol>
              <SettingsPopover />
            </IonCol>
          </IonRow>
        </IonGrid>
        {
          // View balances
          key && view === DashboardViews.KeySummary && (
            <AggregatedBalances
              keyWallets={key ? aggregatedWalletBalances[key] : []}
              onClick={(wallet) => {
                setWalletFocus({
                  ...wallet,
                  address: key,
                });
                wallet.balance
                  ? setView(DashboardViews.ViewWallet)
                  : setView(DashboardViews.CreateWallet);
              }}
            />
          )
        }
        {view === DashboardViews.CreateWallet && (
          <CreateWallet
            coinSymbol={walletFocus.coinSymbol}
            onBack={() => setView(DashboardViews.KeySummary)}
            onCreate={() => {
              setView(DashboardViews.ViewWallet);
            }}
          />
        )}
        {view === DashboardViews.ViewWallet && (
          <ViewWallet
            wallet={walletFocus}
            onBack={() => setView(DashboardViews.KeySummary)}
          />
        )}
        {key && view === DashboardViews.SendView && (
          <SendTable
            keyAddress={key}
            keyWallets={key ? aggregatedWalletBalances[key] : []}
            onClick={(w) => {
              setWalletFocus({
                ...w,
                address: key,
              });
              setView(DashboardViews.SendPage);
            }}
          />
        )}
        {key && view === DashboardViews.SendPage && (
          <Send
            wallet={walletFocus}
            onBack={() => setView(DashboardViews.SendView)}
          />
        )}
        {key && view === DashboardViews.Activity && (
          <Activity
            keyAddress={key}
            onBack={() => setView(DashboardViews.KeySummary)}
          />
        )}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                expand="block"
                onClick={() =>
                  setView(
                    view === DashboardViews.SendView
                      ? DashboardViews.KeySummary
                      : DashboardViews.SendView
                  )
                }
              >
                {view === DashboardViews.SendView ? 'Deposit' : 'Send'}
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                expand="block"
                onClick={() => setView(DashboardViews.Activity)}
              >
                Activity
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
