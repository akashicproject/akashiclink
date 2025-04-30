import styled from '@emotion/styled';
import type { INft } from '@helium-pay/backend';
import { IonCol, IonGrid, IonRow, IonSpinner } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { AlertIcon } from '../../components/common/icons/alert-icon';
import { OneNft } from '../../components/nft/one-nft';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { urls } from '../../constants/urls';
import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { themeType } from '../../theme/const';
import { useNftMe } from '../../utils/hooks/useNftMe';

export const NoNtfWrapper = styled(IonCol)({
  top: '20%',
  position: 'relative',
});

const StyledNftWrapper = styled.div({
  margin: '16px',
  ['&:last-child']: {
    marginBottom: '40px',
  },
});

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
  flexDirection: 'column',
  flexWrap: 'wrap',
  alignContent: 'center',
  position: 'absolute',
  justifyContent: 'space-evenly',
  width: '100%',
}) as GridComponents['List'];

export function Nfts() {
  const { t } = useTranslation();
  const storedTheme = useAppSelector(selectTheme);
  const isDarkMode = storedTheme === themeType.DARK;
  const history = useHistory();
  const { nfts, isLoading } = useNftMe();

  const sortedNfts = [...nfts].sort(
    (a, b) => (b.aas?.linked ? 1 : 0) - (a.aas?.linked ? 1 : 0)
  );

  const selectNft = (nft: INft) => {
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
    <DashboardLayout>
      <IonGrid>
        {nfts.length === 0 && (
          <IonRow
            className="ion-justify-content-center"
            style={{ marginTop: '25vh' }}
          >
            {isLoading && (
              <IonCol size={'12'} className="ion-center">
                <IonSpinner name="circular"></IonSpinner>
              </IonCol>
            )}
            {!isLoading && (
              <>
                <IonCol size={'12'} className="ion-center">
                  <AlertIcon />
                </IonCol>
                <IonCol size={'12'} className="ion-center">
                  <NoNtfText>{t('DoNotOwnNfts')}</NoNtfText>
                </IonCol>
              </>
            )}
          </IonRow>
        )}
        {!isLoading && nfts.length > 0 && (
          <IonRow className="ion-padding-0 ion-justify-content-center">
            <Virtuoso
              style={{
                minHeight: 'calc(100vh - 120px - var(--ion-safe-area-bottom)',
                width: '360px',
              }}
              totalCount={nfts.length}
              data={sortedNfts}
              components={{
                List: ListContainer,
              }}
              itemContent={(_index, nft) => (
                <StyledNftWrapper key={nft.name}>
                  <OneNft
                    isBig={true}
                    nft={nft}
                    select={() => selectNft(nft)}
                    isAASDarkStyle={!isDarkMode}
                  />
                </StyledNftWrapper>
              )}
            />
          </IonRow>
        )}
      </IonGrid>
    </DashboardLayout>
  );
}
