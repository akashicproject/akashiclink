import './ntf.css';

import styled from '@emotion/styled';
import { IonCol, IonIcon, IonRow, isPlatform } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { CustomAlert } from '../../components/alert/alert';
import { PurpleButton, SquareWhiteButton } from '../../components/buttons';
import { NftLayout } from '../../components/layout/nft-layout';
import { AasListingSwitch } from '../../components/nft/aas-listing-switch';
import { OneNft } from '../../components/nft/one-nft';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { akashicPayPath } from '../../routing/navigation-tree';
import { useNftMe } from '../../utils/hooks/useNftMe';

const NftWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '24px',
  width: '100%',
  position: 'relative',
});

export function Nft() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const state = history.location.state?.nft;

  const { nfts } = useNftMe();
  const currentNft = nfts.find((nft) => nft.name === state?.nftName)!;
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = isPlatform('mobile');

  const transferNft = () => {
    if (currentNft.acns?.value !== null) {
      setIsOpen(true);
      return;
    }
    history.push({
      pathname: akashicPayPath(urls.nftTransfer),
      state: history.location.state,
    });
  };
  return (
    <NftLayout>
      <SquareWhiteButton
        class="icon-button"
        style={{
          position: 'absolute',
          float: 'left',
          left: '5%',
          top: '4rem',
        }}
        forceStyle={{
          backgroundColor: 'transparent',
          borderColor: 'white',
        }}
        onClick={() => history.goBack()}
      >
        <IonIcon
          style={{ color: 'white' }}
          class="icon-button-icon"
          slot="icon-only"
          icon={arrowBack}
        />
      </SquareWhiteButton>
      <CustomAlert
        state={{
          visible: isOpen,
          message: t('NSRecordWarning', { nftName: currentNft?.name || '' }),
          success: false,
          onConfirm: () => {
            setIsOpen(false);
          },
        }}
      />
      <NftWrapper style={{ top: isMobile ? '-10vh' : '-15vh' }}>
        <IonRow style={{ width: '215px' }}>
          <IonCol class="ion-center">
            <OneNft nft={currentNft} isBig={true} isAccountNameHidden={true} />
          </IonCol>
        </IonRow>
        <IonRow style={{ width: '215px' }}>
          <IonCol>
            <PurpleButton
              expand="block"
              style={{ width: '181px' }}
              onClick={transferNft}
            >
              {t('Transfer')}
            </PurpleButton>
          </IonCol>
        </IonRow>
        {currentNft && currentNft.acns ? (
          <AasListingSwitch
            name={currentNft.acns!.name}
            aasValue={currentNft.acns?.value ?? ''}
          />
        ) : (
          <></>
        )}
      </NftWrapper>
    </NftLayout>
  );
}
