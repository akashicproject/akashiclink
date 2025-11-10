import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import { IonContent, IonIcon, IonPopover } from '@ionic/react';
import { qrCodeOutline } from 'ionicons/icons';
import { type MouseEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  type DepositChainOption,
  useAccountL1Address,
} from '../../utils/hooks/useAccountL1Address';
import { displayLongText } from '../../utils/long-text';
import { L2Icon } from '../common/chain-icon/l2-icon';
import { NetworkIcon } from '../common/chain-icon/network-icon';
import { CopyIcon } from '../common/icons/copy-icon';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '325px',
  height: '52px',
  justifyContent: 'space-between',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '1px 1px 10px 0px rgba(0, 0, 0, 0.1);',
  },
});

const CryptoChainAddressItem = ({
  chain,
  onClick,
}: {
  chain: DepositChainOption;
  onClick: (chain: DepositChainOption) => void;
}) => {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const copyAddressPopover = useRef<HTMLIonPopoverElement>(null);

  const { address, isAC } = useAccountL1Address(chain);

  const displayName = isAC
    ? t('Chain.AkashicChain')
    : t(`Chain.${chain.toUpperCase()}`);

  const copyAddress = async (e: MouseEvent<Element>, address?: string) => {
    e.stopPropagation();
    if (!address) return;

    copyAddressPopover.current!.event = e;

    await Clipboard.write({
      string: address,
    });

    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  return (
    <Container
      className="ion-padding-top-xs ion-padding-bottom-xs ion-padding-left-md ion-padding-right-md"
      onClick={() => onClick && onClick(chain)}
    >
      <div className={'ion-display-flex ion-align-items-center ion-gap-sm'}>
        {chain === 'AkashicChain' ? (
          <L2Icon size={32} />
        ) : (
          <NetworkIcon chain={chain} size={32} />
        )}
        <div
          className={
            'ion-display-flex ion-flex-direction-column ion-justify-content-center'
          }
        >
          <div
            className="ion-text-size-sm ion-text-bold"
            style={{ color: 'var(--ion-text-color-alt)' }}
          >
            {displayName}
          </div>
          <div
            className="ion-text-size-xs"
            style={{ color: 'var(--ion-text-color-alt)' }}
          >
            {displayLongText(address, 18)}
          </div>
        </div>
      </div>
      <div className={'ion-display-flex ion-align-items-center ion-gap-xs'}>
        <IonIcon icon={qrCodeOutline} />
        <CopyIcon slot="icon-only" onClick={(e) => copyAddress(e, address)} />
        <IonPopover
          side="top"
          alignment="center"
          className={'copied-popover'}
          isOpen={popoverOpen}
          ref={copyAddressPopover}
          reference={'event'}
          onDidDismiss={() => setPopoverOpen(false)}
        >
          <IonContent>{t('Copied')}</IonContent>
        </IonPopover>
      </div>
    </Container>
  );
};
export default CryptoChainAddressItem;
