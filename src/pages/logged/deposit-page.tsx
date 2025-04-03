import './deposit-page.scss';

import styled from '@emotion/styled';
import type { CoinSymbol } from '@helium-pay/backend';
import { NetworkDictionary } from '@helium-pay/backend';
import { IonCol, IonGrid, IonImg, IonRow, IonText } from '@ionic/react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import { OtkBox } from '../../components/otk-box/otk-box';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { useLargestBalanceKeys } from '../../utils/hooks/useLargestBalanceKeys';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { lastPageStorage } from '../../utils/last-page-storage';
import { WALLET_CURRENCIES } from '../../utils/supported-currencies';
import { LoggedMain } from './logged-main';

const CoinWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0',
  gap: '8px',
});

export function DepositPage() {
  const { t } = useTranslation();

  const [currency, ..._] = useLocalStorage(
    'currency',
    WALLET_CURRENCIES[0].symbol
  );

  // store current page to main logged page if reopen
  useEffect(() => {
    lastPageStorage.store(urls.loggedDeposit);
  }, []);

  // Find specified currency or default to the first one
  const currentWalletCurrency =
    WALLET_CURRENCIES.find((c) => c.symbol === currency) ||
    WALLET_CURRENCIES[0];

  const { keys: addresses, isLoading: isAddressesLoading } =
    useLargestBalanceKeys({
      coinSymbols: Object.keys(NetworkDictionary) as CoinSymbol[],
    });

  const walletAddressDetail = addresses?.find(
    (address) =>
      address.coinSymbol.toLowerCase() ===
      currentWalletCurrency.currency[0].toLowerCase()
  );

  const walletAddress = walletAddressDetail?.address ?? '-';

  if (!isAddressesLoading && walletAddressDetail === undefined) {
    return <Redirect to={akashicPayPath(urls.error)} />;
  }

  return (
    <LoggedMain loading={isAddressesLoading}>
      <IonGrid fixed>
        <IonRow class="ion-justify-content-center ion-no-padding">
          <IonCol class="ion-center" size="12">
            <CoinWrapper>
              {walletAddressDetail?.coinSymbol && (
                <IonImg
                  alt={''}
                  src={currentWalletCurrency.logo}
                  style={{ height: '30px' }}
                />
              )}
              <IonText>
                <h3>{currentWalletCurrency.symbol ?? '-'}</h3>
              </IonText>
            </CoinWrapper>
          </IonCol>
          <IonCol class={'ion-center'} size="12">
            <QRCodeSVG value={walletAddress} size={75} />
          </IonCol>
        </IonRow>
        <IonRow class="ion-justify-content-center ion-no-padding">
          <IonCol size="10">
            <OtkBox
              label={t('PublicAddress')}
              text={walletAddress}
              padding={false}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
    </LoggedMain>
  );
}
