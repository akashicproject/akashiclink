import './ntf.css';

import styled from '@emotion/styled';
import type { INftResponse } from '@helium-pay/backend';
import { IonIcon, IonRow, IonSpinner } from '@ionic/react';
import { alertCircleOutline, arrowBack } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { SquareWhiteButton } from '../../components/buttons';
import { NftLayout } from '../../components/layout/nft-layout';
import { OneNft } from '../../components/nft/one-nft';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
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
  gap: '16px',
  alignContent: 'center',
  position: 'absolute',
  justifyContent: 'center',
  width: '100%',
}) as GridComponents['List'];

const StyledDiv = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 32px',
  gap: '16px',
});
const CenteredTextAndIcon = styled.div({
  transform: 'translate(-50%, -50%)',
  top: '50%',
  left: '50%',
  position: 'absolute',
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export function Nfts() {
  const { t } = useTranslation();
  const history = useHistory();
  const { nfts, isLoading } = useNftMe();
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
      <NftLayout background={false}>
        <StyledDiv>
          <IonRow style={{ justifyContent: 'start' }}>
            <SquareWhiteButton
              className="icon-button"
              style={{
                height: '40px',
                width: '40px',
              }}
              onClick={() => history.push(akashicPayPath(urls.loggedFunction))}
            >
              <IonIcon
                className="icon-button-icon"
                slot="icon-only"
                icon={arrowBack}
              />
            </SquareWhiteButton>
          </IonRow>
          {isLoading ? (
            <NoNtfWrapper>
              <IonSpinner name="circular"></IonSpinner>
            </NoNtfWrapper>
          ) : nfts.length === 0 ? (
            <>
              <NoNtfWrapper>
                <CenteredTextAndIcon>
                  <IonIcon icon={alertCircleOutline} className="alert-icon" />
                  <NoNtfText>{t('DoNotOwnNfts')}</NoNtfText>
                </CenteredTextAndIcon>
              </NoNtfWrapper>
            </>
          ) : (
            <Virtuoso
              style={{
                height: '55vh',
              }}
              overscan={900}
              totalCount={nfts.length}
              data={nfts}
              components={{
                List: ListContainer,
              }}
              itemContent={(_index, nft) => (
                <OneNft
                  style={{ padding: '8px' }}
                  isBig={false}
                  nft={nft}
                  isAccountNameHidden={true}
                  select={() => selectNft(nft)}
                />
              )}
            ></Virtuoso>
          )}
        </StyledDiv>
      </NftLayout>
    </>
  );
}
