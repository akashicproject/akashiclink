import './send.css';

import styled from '@emotion/styled';
import type { CoinSymbol } from '@helium-pay/backend';
import {
  IonCol,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RouteComponentProps } from 'react-router';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { DividerDivWithoutMargin } from '../../components/layout/divider';
import { useKeyMe } from '../../utils/hooks/useKeyMe';
import { SendMain } from './send-main';

const SendWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '40px',
  height: '240px',
  width: '270px',
});

const CurrencyWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  width: '118px',
  height: '76px',
});

const BalanceText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  color: '#290056',
});

const InputWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: '24px',
  width: '270px',
});

const ResultChip = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '16px',
  width: '270px',
  height: '28px',
});

const FeeLeftDiv = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 16px',
  gap: '8px',
  width: '127px',
  height: '28px',
  borderRadius: '8px',
  background: '#41CC9A',
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '10px',
  color: '#FFFFFF',
});

const FeeRightDiv = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 16px',
  gap: '8px',
  width: '127px',
  height: '28px',
  borderRadius: '8px',
  border: '1px solid #7B757F',
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '10px',
  color: '#2B0053',
});

interface WithdrawalTransaction {
  fromAddress: string;
  toAddress: string;
  amount: string;
  coinSymbol: CoinSymbol;
  tokenSymbol?: string;
  actualAmount?: string;
  remark?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props extends RouteComponentProps<{ currency: string }> {}

export function SendTo(props: Props) {
  const { t } = useTranslation();
  const currentCurrency = props.match.params.currency;
  const [_proposedTransactions, _setProposedTransactions] = useState<
    WithdrawalTransaction[]
  >([]);

  const { keys: userWallets } = useKeyMe();
  console.log(userWallets);
  // const [userAddress, setUserAddress] = useState('');
  // const [userCurrency, setUserCurrency] = useState('');
  // const [chain, setChain] = useState<CoinSymbol>();
  // const [toAddress, setToAddress] = useState<string>();
  // const [amount, setAmount] = useState<number>();
  // useEffect(() => {
  //   if (userWallets.length === 0) return;
  //   // Select current chain
  //   if (currentCurrency === 'BTC') {
  //     setChain(CoinSymbol.Bitcoin);
  //   } else if (currentCurrency === 'ETH' || currentCurrency === 'USDT-ERC20') {
  //     setChain(CoinSymbol.Ethereum_Mainnet);
  //   } else if (currentCurrency === 'TRX' || currentCurrency === 'USDT-TRC20') {
  //     setChain(CoinSymbol.Tron);
  //   }
  //   setUserCurrency(currentCurrency);
  // }, [userWallets?.length]);

  return (
    <SendMain>
      <IonRow style={{ marginTop: '50px' }}>
        <IonCol class="ion-center">
          <CurrencyWrapper>
            <IonImg
              alt={''}
              src="/shared-assets/images/eth.png"
              style={{ width: '40px', height: '40px' }}
            />
            <BalanceText>0.000 {currentCurrency}</BalanceText>
          </CurrencyWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <SendWrapper>
            <InputWrapper>
              <IonItem class="input-item">
                <IonLabel class="input-label">{t('SendTo')}</IonLabel>
                <IonInput
                  class="input-input"
                  placeholder="Enter the address"
                  // onIonInput={({ target: { value } }) =>
                  //   setToAddress(value as string)
                  // }
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
                  // onIonInput={({ target: { value } }) =>
                  //   setAmount(value as number)
                  // }
                ></IonInput>
              </IonItem>
            </InputWrapper>
            <DividerDivWithoutMargin />
            <ResultChip>
              <FeeLeftDiv>Gas Free</FeeLeftDiv>
              <FeeRightDiv>Fee: 0.001ETH</FeeRightDiv>
            </ResultChip>
          </SendWrapper>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-between" style={{ marginTop: '24px' }}>
        <IonCol>
          <PurpleButton expand="block">{t('Send')}</PurpleButton>
        </IonCol>
        <IonCol>
          <WhiteButton expand="block">{t('Cancel')}</WhiteButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
