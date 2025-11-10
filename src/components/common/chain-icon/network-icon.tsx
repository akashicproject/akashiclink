import { type CoinSymbol, NetworkDictionary } from '@helium-pay/backend';
import { IonImg } from '@ionic/react';

export const NetworkIcon = ({
  chain,
  size = 24,
}: {
  chain: CoinSymbol;
  size?: number;
}) => {
  const currencyIcon = NetworkDictionary[chain].networkIcon;

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
      }}
    >
      <IonImg src={currencyIcon} style={{ width: 'auto', height: '100%' }} />
    </span>
  );
};
