import './one-nft.scss';

import styled from '@emotion/styled';
import type { INft, INftResponse } from '@helium-pay/backend';
import { IonImg, IonRow } from '@ionic/react';

import { displayLongText } from '../../utils/long-text';
interface Props {
  nft: INft | INftResponse;
  isBig?: boolean;
  select?: () => void;
  isNameHidden?: boolean;
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
});

export function OneNft(props: Props) {
  return (
    <NtfWrapper
      style={
        props.isBig
          ? { width: '181px', height: '245px', padding: '16px', gap: '16px' }
          : { width: '138px', height: '190px', padding: '8px', gap: '10px' }
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
        >
          {displayLongText(props.nft?.account, 10)}
        </NftName>
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
          style={{ color: '#7B757F', fontWeight: '700', fontSize: '12px' }}
        >
          {displayLongText(props.nft?.name)}
        </NftName>
      </IonRow>
    </NtfWrapper>
  );
}
