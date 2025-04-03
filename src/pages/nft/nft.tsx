import './ntf.css';

import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { CustomAlert } from '../../components/alert/alert';
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

export function Nft() {
  const { t } = useTranslation();
  const history = useHistory();

  const { nfts } = useNftMe();
  const [nftName, _] = useLocalStorage('nft', '');
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
