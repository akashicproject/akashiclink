import './one-nft.scss';

import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import type { INft, INftResponse } from '@helium-pay/backend';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonPopover,
  IonRow,
} from '@ionic/react';
import { t } from 'i18next';
import { useRef, useState } from 'react';

import { displayLongText } from '../../utils/long-text';
interface Props {
  nft: INft | INftResponse;
  select?: () => void;
  style?: React.CSSProperties;
  isBig?: boolean;
  isAASDarkStyle?: boolean;
}

const AccountNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8px;
`;
const NtfWrapper = styled.div<{ isAASLinked: boolean }>((props) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  gap: '8px',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '8px',
  borderRadius: '8px',
  borderTopRightRadius: props.isAASLinked ? '0px' : '8px',
  marginTop: props.isAASLinked ? '0px' : '22px',
  background: '#FFF',
  boxShadow: '6px 6px 20px rgba(0,0,0,0.10000000149011612)',
}));

const OneNFTContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  alignItems: 'flex-end',
  cursor: 'pointer',
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

const AASListTag = styled.div<{
  isAASDarkStyle?: boolean;
  isBig?: boolean;
}>((props) => ({
  color: 'var(--ion-color-primary-dark)',
  background: props.isAASDarkStyle ? '#290056' : '#C297FF',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  float: 'right',
  maxWidth: '80%',
  padding: '4px 20px',
}));
export function OneNft(props: Props) {
  const handleCopy = async (accountName: string) => {
    await Clipboard.write({
      string: accountName,
    });
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  return (
    <OneNFTContainer>
      {props.nft?.acns?.value && (
        <AASListTag isAASDarkStyle={props.isAASDarkStyle} isBig={props.isBig}>
          <h5
            className="ion-no-margin ion-text-size-xxs"
            style={props.isAASDarkStyle ? { color: '#FFFFFF' } : {}}
          >
            {t('AALinked')}
          </h5>
        </AASListTag>
      )}
      <NtfWrapper
        isAASLinked={!!props.nft?.acns?.value}
        style={props.style}
        onClick={props.select}
      >
        <IonImg
          alt={props.nft?.description}
          src={props.nft?.image}
          class={
            'nft-img-size ' + props.isBig ? 'nft-image-big' : 'nft-image-small'
          }
        />
        <AccountNameWrapper>
          <h5
            style={{ color: 'var(--ion-color-primary-dark)' }}
            title={props.nft?.account}
            className={'ion-no-margin'}
          >
            {displayLongText(props.nft?.account, props.isBig ? 16 : 14)}
          </h5>
          <IonIcon
            slot="icon-only"
            className="copy-icon"
            style={{
              width: '20px',
              height: '20px',
            }}
            src={`/shared-assets/images/copy-icon-only-dark.svg`}
            onClick={async (e) => {
              e.stopPropagation();
              handleCopy(props.nft?.account);
            }}
          />
          <IonPopover
            side="top"
            alignment="center"
            ref={popover}
            isOpen={popoverOpen}
            className={'copied-popover'}
            onDidDismiss={() => setPopoverOpen(false)}
          >
            <IonContent class="ion-padding">{t('Copied')}</IonContent>
          </IonPopover>
        </AccountNameWrapper>
        <IonRow>
          <NftName
            style={{
              color: '#7B757F',
              fontWeight: '700',
              fontSize: '12px',
            }}
          >
            {displayLongText(props.nft?.name, 16)}
          </NftName>
        </IonRow>
      </NtfWrapper>
    </OneNFTContainer>
  );
}
