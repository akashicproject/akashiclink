import styled from '@emotion/styled';
import { type CoinSymbol } from '@helium-pay/backend';
import { IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccountL1Address } from '../../utils/hooks/useAccountL1Address';
import { L2Icon } from '../common/chain-icon/l2-icon';
import { NetworkIcon } from '../common/chain-icon/network-icon';
import { CopyBox } from '../common/copy-box';
import { CurrencyQrCode } from './currency-qr-code';
import { DepositModalContext } from './deposit-modal-trigger-button';
import { GenerateL1AddressButton } from './generate-l1-address-button';

const CoinWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0',
  gap: '8px',
});

export const CurrencyQrCodeAddress = () => {
  const { t } = useTranslation();
  const { chain } = useContext(DepositModalContext);
  const { address, isChainAllowed, isAC } = useAccountL1Address(chain);

  if (!chain) return null;

  return (
    <IonGrid
      className="ion-padding-top-xxs ion-padding-bottom-lg ion-padding-left-xs ion-padding-right-xs"
      style={{
        width: '100%',
        margin: 0,
      }}
    >
      <IonRow class="ion-justify-content-center ion-grid-row-gap-xs">
        <IonCol class="ion-center" size="12">
          <CoinWrapper>
            {isAC ? (
              <L2Icon size={32} />
            ) : (
              <NetworkIcon size={32} chain={chain as CoinSymbol} />
            )}
            <IonText>
              <h3 className="ion-no-margin">
                {isAC
                  ? t('Chain.AkashicChain')
                  : t(`Chain.${chain.toUpperCase()}`)}
              </h3>
            </IonText>
          </CoinWrapper>
        </IonCol>
        <IonCol class={'ion-center'} size="12">
          <CurrencyQrCode size={160} chain={chain} />
        </IonCol>
        <IonCol size="10">
          <IonText>
            <p className="ion-text-align-center ion-text-size-xs ion-text-color-grey">
              {t('DepositHint', {
                chain: t(`Chain.${chain.toUpperCase()}`),
              })}
            </p>
          </IonText>
        </IonCol>
        <IonCol size="10">
          {(isAC || address) && (
            <CopyBox label={t('DepositAddress')} text={address ?? '-'} />
          )}
          {!isAC && !address && isChainAllowed && (
            <GenerateL1AddressButton chain={chain as CoinSymbol} />
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
