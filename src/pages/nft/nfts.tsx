import './ntf.scss';

import styled from '@emotion/styled';
import type { INftResponse } from '@helium-pay/backend';
import { IonCol, IonIcon, IonRow, IonSpinner } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { Toolbar } from '../../components/layout/toolbar';
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
  justifyContent: 'center',
  width: '100%',
  padding: '0px 12px',
}) as GridComponents['List'];
// eslint-disable-next-line sonarjs/cognitive-complexity
export function Nfts() {
  const { t } = useTranslation();
  const [storedTheme] = useTheme();
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
          <Toolbar showAddress={false} showSetting={false} />
        </IonRow>
        {isLoading ? (
          <IonSpinner name="circular"></IonSpinner>
        ) : nfts.length === 0 ? (
          <>
            <NoNtfWrapper className="ion-center">
              <div>
                <IonRow className="ion-justify-content-center">
                  <IonIcon icon={alertCircleOutline} className="alert-icon" />
                </IonRow>
                <NoNtfText>{t('DoNotOwnNfts')}</NoNtfText>
              </div>
            </NoNtfWrapper>
          </>
        ) : (
          <Virtuoso
            style={{
              height: '70vh',
              width: '100%',
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
