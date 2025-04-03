import './one-nft.css';

import styled from '@emotion/styled';
import type { INft, INftResponse } from '@helium-pay/backend';
import { IonImg } from '@ionic/react';
interface Props {
  nft: INft | INftResponse;
  isBig?: boolean;
  select?: () => void;
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
});

export function OneNft(props: Props) {
  return (
    <NtfWrapper
      style={
        props.isBig
          ? { width: '168px', height: '234px', padding: '12px', gap: '15px' }
          : { width: '112px', height: '156px', padding: '8px', gap: '10px' }
      }
      onClick={props.select}
    >
      <IonImg
        alt={props.nft.description}
        src={props.nft.image}
        class={props.isBig ? 'nft-image-big' : 'nft-image-small'}
      />
      <NftName
        style={
          props.isBig
            ? {
                width: '144px',
                padding: '12px 15px 0px 15px',
                fontSize: '21px',
                lineHeight: '30px',
              }
            : {
                width: '96px',
                padding: '8px 10px 0px 10px',
                fontSize: '14px',
                lineHeight: '20px',
              }
        }
      >
        {props.nft.name}
      </NftName>
    </NtfWrapper>
  );
}
