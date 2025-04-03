import type { CoinSymbol } from '@helium-pay/backend';
import { NetworkDictionary } from '@helium-pay/backend';
import { IonImg } from '@ionic/react';
import React from 'react';

export const NetworkIcon = ({
  chain,
  size = 24,
}: {
  chain: CoinSymbol;
  size?: number;
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        padding: 4,
        borderRadius: '50%',
        backgroundColor: 'var(--chain-icon-background)',
      }}
    >
      <IonImg
        src={NetworkDictionary[chain].networkIcon}
        style={{ width: 'auto ', height: '100%' }}
      />
    </div>
  );
};
