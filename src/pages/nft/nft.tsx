import './ntf.scss';

import styled from '@emotion/styled';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { CustomAlert } from '../../components/common/alert/alert';
import { PurpleButton } from '../../components/common/buttons';
import { Toolbar } from '../../components/layout/toolbar';
import { AasListingSwitch } from '../../components/nft/aas-listing-switch';
import { OneNft } from '../../components/nft/one-nft';
import { NftLayout } from '../../components/page-layout/nft-layout';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useNftMe } from '../../utils/hooks/useNftMe';

export const NftWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  width: '100%',
  position: 'relative',
  background: `linear-gradient(
    to bottom,
    var(--nft-background) 0%,
    var(--nft-background) 40%,
    var(--ion-background-color) 40%,
    var(--ion-background-color) 100%
  )`,
});

export const NftContainer = styled.div`
  width: 180px;
  position: relative;
  margin: 0 auto;
`;
export function Nft() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const state = history.location.state?.nft;

  const { nfts } = useNftMe();
  const currentNft = nfts.find((nft) => nft.name === state?.nftName);
  const [message, setCustomAlertMessage] = useState(
    t('NSRecordWarning', { nftName: currentNft?.name || '' })
  );
  const [isOpen, setIsOpen] = useState(false);

  const transferNft = () => {
    if (currentNft?.acns?.value !== null) {
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
      <div
        style={{
          backgroundColor: 'var(--nft-background)',
        }}
      >
        <Toolbar showSetting={false} backButtonReplaceTarget={urls.nfts} />
      </div>

      <CustomAlert
        state={{
          visible: isOpen,
          message: message,
          success: false,
          onConfirm: () => {
            setIsOpen(false);
          },
        }}
      />
      <NftWrapper>
        <IonGrid fixed={true}>
          <IonRow>
            <NftContainer>
              <OneNft nft={currentNft!} isBig={true} />
            </NftContainer>
          </IonRow>
          <IonRow className="ion-margin">
            <IonCol size="8" offset="2">
              <PurpleButton expand="block" onClick={transferNft}>
                {t('Transfer')}
              </PurpleButton>
            </IonCol>
          </IonRow>

          {currentNft && currentNft.acns && (
            <AasListingSwitch
              name={currentNft.acns!.name}
              aasValue={currentNft.acns?.value ?? ''}
              customAlertHandle={setIsOpen}
              customAlertMessage={setCustomAlertMessage}
            />
          )}
        </IonGrid>
      </NftWrapper>
    </NftLayout>
  );
}
