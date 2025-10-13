import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import type { INftObject } from '@helium-pay/backend';
import { IonContent, IonImg, IonPopover, IonRow } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { displayLongText } from '../../utils/long-text';
import { getNftImage } from '../../utils/nft-image-link';
import { CopyIcon } from '../common/icons/copy-icon';

const AccountNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 16px;
  padding-bottom: 8px;
`;
const NtfWrapper = styled.div<{
  isAASLinked: boolean;
  isAASDarkStyle?: boolean;
  isBig?: boolean;
}>(({ isBig, isAASLinked }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-end',
  padding: '8px',
  borderRadius: isBig ? '24px' : '8px',
  borderTopRightRadius: isAASLinked ? '0px' : isBig ? '24px' : '8px',
  marginTop: isAASLinked ? '0px' : '20px',
  background: 'var(--nft-background)',
  boxShadow: '6px 6px 20px rgba(0,0,0,0.10000000149011612)',
  ['& ion-img::part(image)']: {
    borderRadius: isBig ? '20px' : '10px',
  },
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
  color: '#000',
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  textAlign: 'center',
  lineHeight: '16px',
  cursor: 'pointer',
  paddingBottom: '8px',
});

const AASListTag = styled.div({
  color: 'var(--ion-color-primary-dark)',
  background: 'var(--ion-color-primary-70)',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  float: 'right',
  maxWidth: '80%',
  padding: '4px 20px',
});

type OneNftProps = {
  nft: INftObject;
  isLinked?: boolean;
  select?: () => void;
  style?: React.CSSProperties;
  isBig?: boolean;
  isAASDarkStyle?: boolean;
  screen?: string;
};

export function OneNft({
  nft,
  isLinked,
  select,
  style = {},
  isBig = false,
  isAASDarkStyle = false,
  screen,
}: OneNftProps) {
  const { t } = useTranslation();
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [nftUrl, setNftUrl] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCopy = async (accountName: string) => {
    await Clipboard.write({
      string: accountName,
    });
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  useEffect(() => {
    async function getNft() {
      const nftUrl = await getNftImage(nft?.ledgerId);
      setNftUrl(nftUrl);
    }
    getNft();
  }, [nft?.ledgerId]);

  const isAASLinked = isLinked !== undefined ? isLinked : !!nft.aas.linked;

  return (
    <OneNFTContainer>
      {isLinked && (
        <div style={{ width: '100%' }}>
          <AASListTag>
            <h5
              className="ion-no-margin .ion-text-size-sm"
              style={
                isAASDarkStyle
                  ? { color: 'var(--ion-color-white)' }
                  : { color: '#202020' }
              }
            >
              {t('AALinked')}
            </h5>
          </AASListTag>
        </div>
      )}
      <NtfWrapper
        isAASLinked={isAASLinked}
        style={{
          minHeight: isBig ? '320px' : '280px',
          minWidth: isBig ? '320px' : '280px',
          ...style,
        }}
        onClick={select}
        isAASDarkStyle={isAASDarkStyle}
        isBig={isBig}
      >
        {!imageLoaded && (
          <IonImg
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20%',
              height: '20%',
            }}
            alt="image-loading"
            src={`/shared-assets/images/img-placeholder-${isAASDarkStyle ? 'dark' : 'light'}.svg`}
            className={`nft-image-${isBig ? 'big' : 'small'} nft-img-size`}
          />
        )}

        {nftUrl && (
          <IonImg
            style={{
              position: 'relative',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}
            alt={nft?.description}
            src={nftUrl}
            className={`nft-image-${isBig ? 'big' : 'small'} nft-img-size`}
            onIonImgDidLoad={() => setImageLoaded(true)}
          />
        )}
        <AccountNameWrapper>
          <h5
            style={{
              color: isAASDarkStyle
                ? 'var(--ion-color-primary-dark)'
                : 'var(--ion-color-primary-light)',
            }}
            title={nft?.alias}
            className={`ion-no-margin ${
              screen === 'transfer' ? 'ion-text-size-xs' : 'ion-text-size-sm'
            }`}
          >
            {displayLongText(nft?.alias, 32)}
          </h5>
          <CopyIcon
            size={20}
            slot="icon-only"
            className="copy-icon ion-margin-left-xxs"
            onClick={async (e) => {
              e.stopPropagation();
              handleCopy(nft?.alias);
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
            <IonContent>{t('Copied')}</IonContent>
          </IonPopover>
        </AccountNameWrapper>
        <IonRow>
          <NftName
            style={{
              color: '#958E99',
              fontWeight: '700',
              width: '100%',
            }}
            className={`${
              screen === 'transfer' ? 'ion-text-size-xxs' : 'ion-text-size-xs'
            }`}
          >
            {nft?.name}
          </NftName>
        </IonRow>
      </NtfWrapper>
    </OneNFTContainer>
  );
}
