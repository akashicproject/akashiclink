import './ntf.scss';

import styled from '@emotion/styled';
import { IonCol, IonIcon, IonRow, isPlatform } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { CustomAlert } from '../../components/common/alert/alert';
import {
  PurpleButton,
  SquareWhiteButton,
} from '../../components/common/buttons';
import { AasListingSwitch } from '../../components/nft/aas-listing-switch';
import { OneNft } from '../../components/nft/one-nft';
import { NftLayout } from '../../components/page-layout/nft-layout';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../routing/history';
import { historyGoBackOrReplace } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
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
  const currentNft = nfts.find((nft) => nft.name === state?.nftName);
  const [message, setCustomAlertMessage] = useState(
    t('NSRecordWarning', { nftName: currentNft?.name || '' })
  );
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = isPlatform('mobile');

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

  const onClickBackButton = () => {
    historyGoBackOrReplace();
  };

  return (
    <NftLayout>
      <SquareWhiteButton
        className="icon-button"
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
        onClick={onClickBackButton}
      >
        <IonIcon
          style={{ color: 'white' }}
          className="icon-button-icon"
          slot="icon-only"
          icon={arrowBack}
        />
      </SquareWhiteButton>
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
      <NftWrapper style={{ top: isMobile ? '-10vh' : '-15vh' }}>
        <IonRow style={{ width: '215px' }}>
          <IonCol class="ion-center">
            {currentNft && (
              <OneNft
                nft={currentNft}
                isBig={true}
                isAccountNameHidden={true}
              />
            )}
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
            name={currentNft.acns?.name ?? ''}
            aasValue={currentNft.acns?.value ?? ''}
            customAlertHandle={setIsOpen}
            customAlertMessage={setCustomAlertMessage}
          />
        ) : (
          <></>
        )}
      </NftWrapper>
    </NftLayout>
  );
}
