import './ntf.css';

import styled from '@emotion/styled';
import { IonCol, IonIcon, IonRow } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { CustomAlert } from '../../components/alert/alert';
import {
  PurpleButton,
  SquareWhiteButton,
  WhiteButton,
} from '../../components/buttons';
import { NftLayout } from '../../components/layout/nft-layout';
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
  marginTop: '80px',
  gap: '56px',
  width: '100%',
});

export function Nft() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();

  const { nfts } = useNftMe();
  const currentNft = nfts.find(
    (nft) => nft.name === history.location.state?.nftName
  )!;
  const [isOpen, setIsOpen] = useState(false);

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

  const goNSSetting = () => {
    setIsOpen(false);
    history.push(akashicPayPath(urls.settingsNaming));
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
        onClick={() => history.goBack()}
      >
        <IonIcon class="icon-button-icon" slot="icon-only" icon={arrowBack} />
      </SquareWhiteButton>
      <CustomAlert
        state={{
          visible: isOpen,
          onConfirm: goNSSetting,
          message: t('NSRecordWarning', { nftName: currentNft?.name || '' }),
          success: false,
          confirmButtonMessage: t('GoNSSettings') ?? undefined,
        }}
      />
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
    </NftLayout>
  );
}
