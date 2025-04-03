import './ntf.scss';

import styled from '@emotion/styled';
import type { INftResponse } from '@helium-pay/backend';
import { IonCol, IonIcon, IonRow, IonSpinner } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { OneNft } from '../../components/nft/one-nft';
import { NftLayout } from '../../components/page-layout/nft-layout';
import { useTheme } from '../../components/providers/PreferenceProvider';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { themeType } from '../../theme/const';
import { useNftMe } from '../../utils/hooks/useNftMe';

export const NoNtfWrapper = styled(IonCol)({
  top: '20%',
  position: 'relative',
});

const StyledNftWrapper = styled.div`
  height: 220px;
  width: 148px;
  margin: 16px 8px;
`;
export const NoNtfText = styled(IonRow)({
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
  justifyContent: 'space-between',
  width: '100%',
  padding: '0px 12px',
}) as GridComponents['List'];

export function Nfts() {
  const { t } = useTranslation();
  const [storedTheme] = useTheme();
  const isDarkMode =
    storedTheme === themeType.DARK || storedTheme === themeType.SYSTEM;
  const history = useHistory();
  const { nfts, isLoading } = useNftMe();
  const sortedNfts = nfts.sort((a, b) => {
    if (a.acns?.value && !b.acns?.value) return -1;
    if (!a.acns?.value && b.acns?.value) return 1;
    return 0;
  });

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
    <NftLayout>
      {isLoading && <IonSpinner name="circular"></IonSpinner>}
      {!isLoading && nfts.length === 0 && (
        <NoNtfWrapper className="ion-center">
          <div>
            <IonRow className="ion-justify-content-center">
              <IonIcon icon={alertCircleOutline} className="alert-icon" />
            </IonRow>
            <NoNtfText>{t('DoNotOwnNfts')}</NoNtfText>
          </div>
        </NoNtfWrapper>
      )}
      {!isLoading && nfts.length > 0 && (
        <Virtuoso
          style={{
            height: '70vh',
            width: '100%',
          }}
          overscan={900}
          totalCount={nfts.length}
          data={sortedNfts}
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
  );
}
