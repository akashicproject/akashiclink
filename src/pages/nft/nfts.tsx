import './ntf.css';

import styled from '@emotion/styled';
import type { INftResponse } from '@helium-pay/backend';
import { IonIcon, IonRow, IonSpinner, isPlatform } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { HomeButton } from '../../components/home-button';
import { NftLayout } from '../../components/layout/nft-layout';
import { OneNft } from '../../components/nft/one-nft';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { useNftMe } from '../../utils/hooks/useNftMe';

export const NoNtfWrapper = styled.div({
  width: '100%',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  marginTop: '200px',
});

export const NoNtfText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

const ListContainer = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
}) as GridComponents['List'];

const ItemContainer = styled.div({
  width: '33%',
  display: 'flex',
  flex: 'none',
  alignContent: 'stretch',
  boxSizing: 'border-box',
  marginBottom: '10px',
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export function Nfts() {
  const { t } = useTranslation();
  const history = useHistory();
  const isMobile = isPlatform('mobile');

  const { nfts, isLoading } = useNftMe();
  const [_, setNft, __] = useLocalStorage('nft', '');
  const selectNft = (nft: INftResponse) => {
    setNft(nft.name);
    history.push({
      pathname: akashicPayPath(urls.nft),
      state: {
        nftName: nft.name,
        chainType: nft.chainType,
      },
    });
  };
  return (
    <NftLayout>
      {isLoading ? (
        <NoNtfWrapper>
          <IonSpinner name="circular"></IonSpinner>
        </NoNtfWrapper>
      ) : nfts.length === 0 ? (
        <NoNtfWrapper>
          <IonIcon icon={alertCircleOutline} class="alert-icon" />
          <NoNtfText>{t('DoNotOwnNfts')}</NoNtfText>
        </NoNtfWrapper>
      ) : (
        <Virtuoso
          style={{
            marginTop: isMobile ? '40px' : '20px',
            height: isMobile ? '500px' : '400px',
            padding: '8px',
          }}
          overscan={900}
          totalCount={nfts.length}
          data={nfts}
          components={{
            Item: ItemContainer,
            List: ListContainer,
          }}
          itemContent={(_index, nft) => (
            <OneNft nft={nft} select={() => selectNft(nft)} />
          )}
        ></Virtuoso>
      )}
      <IonRow
        class="ion-justify-content-center"
        style={{
          position: 'fixed',
          bottom: isMobile ? '100px' : '5px',
          width: '100%',
        }}
      >
        <HomeButton />
      </IonRow>
    </NftLayout>
  );
}
