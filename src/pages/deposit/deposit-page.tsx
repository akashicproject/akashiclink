import './deposit-page.scss';

import styled from '@emotion/styled';
import type { CoinSymbol } from '@helium-pay/backend';
import { NetworkDictionary } from '@helium-pay/backend';
import { IonCol, IonGrid, IonImg, IonRow, IonText } from '@ionic/react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

import { OtkBox } from '../../components/otk-box/otk-box';
import { LayoutWithActivityTab } from '../../components/page-layout/layout-with-activity-tab';
import {
  useFocusCurrency,
  useTheme,
} from '../../components/providers/PreferenceProvider';
import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../constants/currencies';
import { themeType } from '../../theme/const';
import { useLargestBalanceKeys } from '../../utils/hooks/useLargestBalanceKeys';

const CoinWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0',
  gap: '8px',
});

export function DepositPage() {
  const { t } = useTranslation();
  const [currency] = useFocusCurrency();
  const [storedTheme] = useTheme();

  // Find specified currency or default to the first one
  const currentWalletMetadata =
    SUPPORTED_CURRENCIES_FOR_EXTENSION.lookup(currency);

  const { keys: addresses, isLoading: isAddressesLoading } =
    useLargestBalanceKeys({
      coinSymbols: Object.keys(NetworkDictionary) as CoinSymbol[],
    });

  const walletAddressDetail = addresses?.find(
    (address) =>
      address.coinSymbol.toLowerCase() ===
      currentWalletMetadata.walletCurrency.chain.toLowerCase()
  );
  const walletAddress = walletAddressDetail?.address ?? '-';

  // TODO: this redirection is still buggy (very strange) need to take good look at how routing works
  // if (!isAddressesLoading && walletAddressDetail === undefined) {
  //   return <Redirect to={akashicPayPath(urls.error)} />;
  // }

  return (
    <LayoutWithActivityTab showRefresh={false} loading={isAddressesLoading}>
      <IonGrid fixed>
        <IonRow class="ion-justify-content-center ion-no-padding">
          <IonCol class="ion-center" size="12">
            <CoinWrapper>
              {walletAddressDetail?.coinSymbol && (
                <IonImg
                  alt={''}
                  src={
                    storedTheme === themeType.DARK
                      ? currentWalletMetadata.darkCurrencyIcon
                      : currentWalletMetadata.currencyIcon
                  }
                  style={{ height: '30px' }}
                />
              )}
              <IonText>
                <h3>
                  {currentWalletMetadata.walletCurrency.displayName ?? '-'}
                </h3>
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
    </LayoutWithActivityTab>
  );
}
