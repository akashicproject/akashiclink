import { type CoinSymbol } from '@akashic/as-backend';
import styled from '@emotion/styled';
import { IonImg, IonSpinner } from '@ionic/react';
import { QRCodeSVG } from 'qrcode.react';

import { useAccountL1Address } from '../../utils/hooks/useAccountL1Address';

const QRCodeWrapper = styled.div<{ size: number }>(({ size }) => ({
  lineHeight: 0,
  padding: 8,
  backgroundColor: 'var(--ion-color-white)',
  borderRadius: 8,
  margin: 4,
  width: size + 8,
  height: size + 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const CurrencyQrCode = ({
  isLoading = false,
  size = 100,
  chain,
}: {
  isLoading?: boolean;
  size?: number;
  chain: CoinSymbol | 'AkashicChain';
}) => {
  const { address, isChainAllowed } = useAccountL1Address(chain);

  return (
    <QRCodeWrapper size={size}>
      {isLoading && <IonSpinner color="primary" name="circular" />}
      {!isLoading && !address && (
        <IonImg
          alt=""
          src={`/shared-assets/images/${
            isChainAllowed ? 'Pending' : 'Failed'
          }-white.svg`}
        />
      )}
      {!isLoading && address && <QRCodeSVG value={address} size={size} />}
    </QRCodeWrapper>
  );
};
