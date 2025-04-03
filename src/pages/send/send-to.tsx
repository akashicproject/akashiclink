import './send.css';

import styled from '@emotion/styled';
import type { ITransactionVerifyResponse as VerifiedTransaction } from '@helium-pay/backend';
import {
  IonCol,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSpinner,
  useIonRouter,
} from '@ionic/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RouteComponentProps } from 'react-router';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { useAggregatedBalances } from '../../components/select-coin';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';
import { OwnersAPI } from '../../utils/api';
import { useKeyMe } from '../../utils/hooks/useKeyMe';
import { lastPageStorage } from '../../utils/last-page-storage';
import { WALLET_CURRENCIES } from '../../utils/supported-currencies';
import { SendConfirm } from './send-confirm';
import { SendMain } from './send-main';
import { SendResult } from './send-result';

/** Styled components */
const SendWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '40px',
  height: '180px',
  width: '270px',
});

const CurrencyWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  width: '100%',
  height: '76px',
});

const BalanceText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  color: '#290056',
  textAlign: 'center',
});

const InputWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: '24px',
  width: '270px',
});

const Error = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '24px',
  color: 'red',
  textAlign: 'center',
});

/** Corresponds to steps taken by user as they make a withdrawal */
enum SendView {
  Send = 'Send',
  Confirm = 'Confirm',
  Result = 'Result',
}

export function SendTo({
  match: { params },
}: RouteComponentProps<{ coinSymbol?: string }>) {
  const { t } = useTranslation();
  const router = useIonRouter();
  const aggregatedBalances = useAggregatedBalances();
  const { keys: userWallets } = useKeyMe();
  const { coinSymbol } = params;

  // store current page to main logged page if reopen
  useEffect(() => {
    lastPageStorage.store(urls.loggedFunction);
  }, []);

  // Find specified currency or default to the first one
  const currentWalletCurrency =
    WALLET_CURRENCIES.find((currency) => currency.symbol === coinSymbol) ||
    WALLET_CURRENCIES[0];

  // Keeps track of which page the user is at
  const [pageView, setPageView] = useState(SendView.Send);

  const [verifiedTransaction, setVerifiedTransaction] =
    useState<VerifiedTransaction>();

  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [signError, setSignError] = useState(errorMsgs.NoError);
  const [verifyError, setVerifyError] = useState(errorMsgs.NoError);
  const [loading, setLoading] = useState(false);

  // Send transaction to the backend for verification
  const verifyTransaction = async () => {
    setLoading(true);
    const currentWallet = userWallets.filter((wallet) => {
      return wallet.coinSymbol === currentWalletCurrency.currency[0];
    })[0];
    const coinSymbol = currentWalletCurrency.currency[0];
    const tokenSymbol = currentWalletCurrency.currency[1];
    const originalTxn = {
      fromAddress: currentWallet.address,
      toAddress: toAddress,
      amount: amount,
      coinSymbol: coinSymbol,
      tokenSymbol: tokenSymbol ? tokenSymbol : undefined,
    };
    try {
      const response = await OwnersAPI.verifyTransaction(originalTxn);
      setVerifiedTransaction(response[0]);
      setPageView(SendView.Confirm);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setVerifyError(error?.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {pageView === SendView.Send && (
        <SendMain>
          <IonRow style={{ marginTop: '50px' }}>
            <IonCol class="ion-center">
              <CurrencyWrapper>
                <IonImg
                  alt={''}
                  src={currentWalletCurrency.logo}
                  style={{ width: '40px', height: '40px' }}
                />
                <BalanceText>
                  {aggregatedBalances.get(currentWalletCurrency.currency)}{' '}
                  {currentWalletCurrency.symbol}
                </BalanceText>
              </CurrencyWrapper>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '40px' }}>
            <IonCol class="ion-center">
              <SendWrapper>
                <InputWrapper>
                  <IonItem class="input-item">
                    <IonLabel class="input-label">{t('SendTo')}</IonLabel>
                    <IonInput
                      class="input-input"
                      placeholder="Enter the address"
                      onIonInput={({ target: { value } }) =>
                        setToAddress(value as string)
                      }
                    ></IonInput>
                  </IonItem>
                </InputWrapper>
                <InputWrapper>
                  <IonItem class="input-item">
                    <IonLabel class="input-label">{t('Amount')}</IonLabel>
                    <IonInput
                      class="input-input"
                      type="number"
                      placeholder="Enter the amount"
                      onIonInput={({ target: { value } }) =>
                        setAmount(value as string)
                      }
                    ></IonInput>
                  </IonItem>
                </InputWrapper>
              </SendWrapper>
            </IonCol>
          </IonRow>
          {verifyError === errorMsgs.NoError ? null : (
            <IonRow>
              <IonCol class="ion-center">
                <Error>{verifyError}</Error>
              </IonCol>
            </IonRow>
          )}
          <IonRow
            class="ion-justify-content-between"
            style={{ padding: '0px 50px' }}
          >
            <IonCol>
              <PurpleButton
                expand="block"
                onClick={verifyTransaction}
                disabled={loading}
              >
                {t('Send')}
                {loading ? (
                  <IonSpinner style={{ marginLeft: '10px' }}></IonSpinner>
                ) : null}
              </PurpleButton>
            </IonCol>
            <IonCol>
              <WhiteButton
                expand="block"
                routerLink={heliumPayPath(urls.loggedFunction)}
              >
                {t('Cancel')}
              </WhiteButton>
            </IonCol>
          </IonRow>
        </SendMain>
      )}
      {pageView === SendView.Confirm && (
        <SendConfirm
          coinSymbol={coinSymbol || ''}
          transaction={verifiedTransaction}
          isResult={() => setPageView(SendView.Result)}
          getErrorMsg={(errorMsg) => setSignError(errorMsg)}
          goBack={() => router.goBack()}
        />
      )}
      {pageView === SendView.Result && (
        <SendResult
          errorMsg={signError}
          transaction={verifiedTransaction}
          coinSymbol={coinSymbol || ''}
          goBack={() => router.goBack()}
        />
      )}
    </>
  );
}
