import './one-nft.scss';

import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import type { INft, INftResponse } from '@helium-pay/backend';
import { IonContent, IonImg, IonPopover, IonRow } from '@ionic/react';
import { t } from 'i18next';
import { useRef, useState } from 'react';

import { displayLongText } from '../../utils/long-text';
interface Props {
  nft: INft | INftResponse;
  isBig?: boolean;
  select?: () => void;
  style?: React.CSSProperties;
  isNameHidden?: boolean;
  nftNameStyle?: React.CSSProperties;
  isAccountNameHidden?: boolean;
}

const NtfWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  background: '#FFF',
});

const NftName = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#FFF',
  color: '#000',
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  textAlign: 'center',
  lineHeight: '16px',
  cursor: 'pointer',
});

export function OneNft(props: Props) {
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  return (
    <NtfWrapper
      style={
        props.isBig
          ? {
              width: '181px',
              height: '245px',
              padding: '16px',
              gap: '16px',
              ...props.style,
            }
          : {
              width: '138px',
              height: '190px',
              padding: '8px',
              gap: '8px',
              ...props.style,
            }
      }
      onClick={props.select}
    >
      <div
        hidden={props.isNameHidden}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <NftName
          style={{
            fontSize: '14px',
          }}
          title={`Copy ${props.nft?.account}`}
          onClick={async (e) => {
            await Clipboard.write({
              string: props.nft?.account,
            });
            if (popover.current) popover.current.event = e;
            setPopoverOpen(true);
            setTimeout(() => {
              setPopoverOpen(false);
            }, 1000);
          }}
        >
          {displayLongText(props.nft?.account, 9, true)}
        </NftName>
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
        <div hidden={!props?.nft?.acns?.value}>
          <div className={`chip-${props.isBig ? 'big' : 'small'}`}>AAS</div>
        </div>
      </div>
      <div>
        <IonImg
          alt={props.nft?.description}
          src={props.nft?.image}
          class={props.isBig ? 'nft-image-big' : 'nft-image-small'}
        />
      </div>
      <IonRow>
        <NftName
          style={{
            color: '#7B757F',
            fontWeight: '700',
            fontSize: '12px',
            ...props.nftNameStyle,
          }}
        >
          {props.nft?.name}
        </NftName>
      </IonRow>
      <div hidden={props.isAccountNameHidden}>
        <NftName
          style={{
            textAlign: 'center',
            width: '100%',
            fontSize: '14px',
            color: '#7B757F',
          }}
        >
          {displayLongText(props.nft?.account)}
        </NftName>
      </div>
    </NtfWrapper>
  );
}
