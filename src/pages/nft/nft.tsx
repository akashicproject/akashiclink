import './ntf.css';

import styled from '@emotion/styled';
import { IonCol, IonImg, IonModal, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { NftLayout } from '../../components/layout/nft-layout';
import { OneNft } from '../../components/nft/one-nft';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { useNftMe } from '../../utils/hooks/useNftMe';

const NftWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  marginTop: '80px',
  gap: '56px',
  width: '100%',
});

export const WarningDiv = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  marginTop: '64px',
  padding: '0 40px',
});

const WarningText = styled.div({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  width: '253px',
  height: '69px',
  fontFamily: 'Nunito Sans',
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#000',
});

export function Nft() {
  const { t } = useTranslation();
  const history = useHistory();

  const { nfts } = useNftMe();
  const [_, __, nftName] = useLocalStorage('nft', '');
  const currentNft = nfts.find((nft) => nft.name === nftName) || nfts[0];
  const [isOpen, setIsOpen] = useState(false);

  const transferNft = () => {
    if (currentNft.acns?.value !== null) {
      setIsOpen(true);
      return;
    }
    history.push(akashicPayPath(urls.nftTransfer));
  };

  const goNSSetting = () => {
    setIsOpen(false);
    history.push(akashicPayPath(urls.settingsNaming));
  };

  return (
    <NftLayout>
      <NftWrapper>
        <IonRow>
          <IonCol class="ion-center">
            <OneNft nft={currentNft} isBig={true} />
          </IonCol>
        </IonRow>
        <IonRow style={{ width: '330px' }}>
          <IonCol>
            <PurpleButton expand="block" onClick={transferNft}>
              {t('Transfer')}
            </PurpleButton>
          </IonCol>
          <IonCol>
            <WhiteButton
              expand="block"
              routerLink={akashicPayPath(urls.settingsNaming)}
            >
              {t('NS Settings')}
            </WhiteButton>
          </IonCol>
        </IonRow>
      </NftWrapper>
      <IonModal
        id="nft-model"
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
      >
        <WarningDiv>
          <IonImg
            alt={''}
            src={'/shared-assets/images/error-outline.png'}
            style={{ width: '48px', height: '48px' }}
          />
          <WarningText>
            {t('NSRecordWarning', { nftName: currentNft?.name || '' })}
          </WarningText>
          <PurpleButton onClick={goNSSetting} style={{ width: '160px' }}>
            {t('GoNSSettings')}
          </PurpleButton>
        </WarningDiv>
      </IonModal>
    </NftLayout>
  );
}
