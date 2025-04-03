import './ntf.css';

import styled from '@emotion/styled';
import type { INftResponse } from '@helium-pay/backend';
import { IonIcon, IonSpinner } from '@ionic/react';
import { alertCircleOutline, arrowBack } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { SquareWhiteButton } from '../../components/buttons';
import { ActivityAndNftTabComponent } from '../../components/layout/activity-and-nft-tab';
import { NftLayout } from '../../components/layout/nft-layout';
import { OneNft } from '../../components/nft/one-nft';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { useNftMe } from '../../utils/hooks/useNftMe';

export const NoNtfWrapper = styled.div({
  marginTop: '50px',
  width: '100%',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  position: 'relative',
  height: '40vh',
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
  alignContent: 'center',
  position: 'absolute',
  justifyContent: 'center',
  width: '100%',
}) as GridComponents['List'];

const CenteredTextAndIcon = styled.div({
  transform: 'translate(-50%, -50%)',
  top: '50%',
  left: '50%',
  position: 'absolute',
});

const ItemContainer = styled.div({
  margin: '20px',
  height: 'auto',
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export function Nfts() {
  const { t } = useTranslation();
  const history = useHistory();
  const { nfts, isLoading } = useNftMe();
  const [nftTab, setNftTab] = useState(true);
  const selectNft = (nft: INftResponse) => {
    history.push({
      pathname: akashicPayPath(urls.nft),
      state: {
        nft: {
          nftName: nft.name,
          chainType: nft.chainType,
        },
      },
    });
  };
  return (
    <>
      <NftLayout>
        <ActivityAndNftTabComponent
          nftTab={nftTab}
          setNftTab={setNftTab}
          fromNfts={true}
        />
        <SquareWhiteButton
          class="icon-button"
          style={{
            position: 'absolute',
            float: 'left',
            left: '5%',
            top: '6.5rem',
          }}
          onClick={() => history.push(akashicPayPath(urls.loggedFunction))}
        >
          <IonIcon class="icon-button-icon" slot="icon-only" icon={arrowBack} />
        </SquareWhiteButton>

        {isLoading ? (
          <NoNtfWrapper>
            <IonSpinner name="circular"></IonSpinner>
          </NoNtfWrapper>
        ) : nfts.length === 0 ? (
          <>
            <NoNtfWrapper>
              <CenteredTextAndIcon>
                <IonIcon icon={alertCircleOutline} class="alert-icon" />
                <NoNtfText>{t('DoNotOwnNfts')}</NoNtfText>
              </CenteredTextAndIcon>
            </NoNtfWrapper>
          </>
        ) : (
          <Virtuoso
            style={{
              marginTop: '40px',
              height: '55vh',
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
              <OneNft isBig={false} nft={nft} select={() => selectNft(nft)} />
            )}
          ></Virtuoso>
        )}
      </NftLayout>
    </>
  );
}
