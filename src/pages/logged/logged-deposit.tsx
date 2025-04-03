import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import type { CoinSymbol } from '@helium-pay/backend';
import { NetworkDictionary } from '@helium-pay/backend';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPopover,
  IonRow,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import { QRCodeSVG } from 'qrcode.react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RouteComponentProps } from 'react-router';

import { urls } from '../../constants/urls';
import { heliumPayPath } from '../../routing/navigation-tree';
import { useLargestBalanceKeys } from '../../utils/hooks/useLargestBalanceKeys';
import { LoggedMain } from './logged-main';

const CoinWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0',
  gap: '8px',
});

export function LoggedDeposit({
  match: { params },
}: RouteComponentProps<{ coinSymbol?: string }>) {
  const { t } = useTranslation();
  const router = useIonRouter();

  const selectedCoin = params.coinSymbol;

  const { keys: addresses, isLoading: isAddressesLoading } =
    useLargestBalanceKeys({
      coinSymbols: Object.keys(NetworkDictionary) as CoinSymbol[],
    });

  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const walletAddressDetail = addresses?.find(
    (address) =>
      address.coinSymbol.toLowerCase() === selectedCoin?.toLowerCase()
  );

  const walletAddress = walletAddressDetail?.address ?? '-';
  const networkDetail =
    walletAddressDetail?.coinSymbol &&
    NetworkDictionary[walletAddressDetail?.coinSymbol];

  const copyAddress = async (e: never) => {
    await Clipboard.write({
      string: walletAddress,
    });
    if (popover.current) {
      popover.current.event = e;
    }
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  if (!isAddressesLoading && walletAddressDetail === undefined) {
    router.push(heliumPayPath(urls.error));
  }

  return (
    <LoggedMain loading={isAddressesLoading}>
      <IonGrid fixed>
        <IonRow class="ion-justify-content-center ion-margin-vertical">
          <IonCol class={'ion-center'} size="12">
            <CoinWrapper>
              {walletAddressDetail?.coinSymbol && networkDetail && (
                <IonImg
                  alt={''}
                  src={`/shared-assets/images/${networkDetail.nativeCoin.symbol.toLowerCase()}.png`}
                  style={{ width: '40px', height: '40px' }}
                />
              )}
              <IonText>
                <h3>{networkDetail?.nativeCoin?.symbol ?? '-'}</h3>
              </IonText>
            </CoinWrapper>
          </IonCol>
          <IonCol class={'ion-center'} size="12">
            <QRCodeSVG value={walletAddress} size={120} />
          </IonCol>
        </IonRow>
        <IonRow class="ion-justify-content-center">
          <IonCol size={'10'}>
            <IonLabel position="stacked">{t('PublicAddress')}</IonLabel>
            {/* TODO: a known issue before ionic 7 where IonItem is not clickable when IonInput within is disabled: https://github.com/ionic-team/ionic-framework/issues/23331, Resolved this workaround when migrated to v7 */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div onClick={copyAddress}>
              <IonItem fill="outline">
                <IonInput disabled value={walletAddress}></IonInput>
                <IonIcon slot="end" icon={copyOutline}></IonIcon>
              </IonItem>
            </div>
            <IonPopover
              side="top"
              alignment="center"
              ref={popover}
              isOpen={popoverOpen}
              class={'copied-popover'}
              onDidDismiss={() => setPopoverOpen(false)}
            >
              <IonContent class="ion-padding">{t('Copied')}</IonContent>
            </IonPopover>
          </IonCol>
        </IonRow>
      </IonGrid>
    </LoggedMain>
  );
}
