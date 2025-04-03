import './ntf.scss';

import styled from '@emotion/styled';
import type { INftResponse } from '@helium-pay/backend';
import { IonCol, IonIcon, IonRow, IonSpinner, isPlatform } from '@ionic/react';
import { alertCircleOutline, arrowBack } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { SquareWhiteButton } from '../../components/common/buttons';
import { OneNft } from '../../components/nft/one-nft';
import { NftLayout } from '../../components/page-layout/nft-layout';
import { useTheme } from '../../components/providers/PreferenceProvider';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { themeType } from '../../theme/const';
import { useNftMe } from '../../utils/hooks/useNftMe';

export const NoNtfWrapper = styled.div({
  top: '20%',
  position: 'relative',
});

const StyledNftWrapper = styled.div`
  height: 220px;
  width: 152px;
  margin: 16px 8px;
`;
export const NoNtfText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

const StyledIonCol = styled(IonCol)`
  padding-top: 12px;
`;
const ListContainer = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'center',
  position: 'absolute',
  justifyContent: 'flex-start',
  width: '100%',
}) as GridComponents['List'];
// eslint-disable-next-line sonarjs/cognitive-complexity
export function Nfts() {
  const { t } = useTranslation();
  const [storedTheme, setStoredTheme] = useTheme();
  const isDarkMode =
    storedTheme === themeType.DARK || storedTheme === themeType.SYSTEM;
  const history = useHistory();
  const { nfts, isLoading } = useNftMe();
  const selectNft = (nft: INftResponse) => {
    history.push({
      pathname: akashicPayPath(urls.nft),
      state: {
        nft: {
          nftName: nft.name,
        },
      },
    });
  };
  return (
    <>
      <NftLayout>
        <IonRow>
          <StyledIonCol size={'3'}>
            <SquareWhiteButton
              className="icon-button"
              onClick={() => {
                history.goBack();
              }}
            >
              <IonIcon
                className="icon-button-icon"
                slot="icon-only"
                src={`/shared-assets/images/${
                  storedTheme === themeType.DARK
                    ? 'back-arrow-white.svg'
                    : 'back-arrow-purple.svg'
                }`}
              />
            </SquareWhiteButton>
          </StyledIonCol>
        </IonRow>
        {isLoading ? (
          <IonSpinner name="circular"></IonSpinner>
        ) : nfts.length === 0 ? (
          <>
            <NoNtfWrapper>
              <div>
                <IonIcon icon={alertCircleOutline} className="alert-icon" />
                <NoNtfText>{t('DoNotOwnNfts')}</NoNtfText>
              </div>
            </NoNtfWrapper>
          </>
        ) : (
          <Virtuoso
            style={{
              height: '70vh',
              padding: '0px 12px',
            }}
            overscan={900}
            totalCount={nfts.length}
            data={nfts}
            components={{
              Item: StyledNftWrapper,
              List: ListContainer,
            }}
            itemContent={(_index, nft) => (
              <OneNft
                isBig={false}
                nft={nft}
                select={() => selectNft(nft)}
                isAASDarkStyle={!isDarkMode}
              />
            )}
          ></Virtuoso>
        )}
      </NftLayout>
    </>
  );
}
