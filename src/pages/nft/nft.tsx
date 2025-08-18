import styled from '@emotion/styled';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import { PrimaryButton } from '../../components/common/buttons';
import { AlertIcon } from '../../components/common/icons/alert-icon';
import { AasListingSwitch } from '../../components/nft/aas-listing-switch';
import { OneNft } from '../../components/nft/one-nft';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import { urls } from '../../constants/urls';
import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';
import type { LocationState } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { themeType } from '../../theme/const';
import { useIsScopeAccessAllowed } from '../../utils/account';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { NoNtfText } from './nfts';

export const NftWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  width: '100%',
  position: 'relative',
});

export function Nft() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const state = history.location.state?.nft;
  const [alert, setAlert] = useState(formAlertResetState);
  const { nfts } = useNftMe();
  const isSendAllowed = useIsScopeAccessAllowed('nftTransfer');

  const currentNft = nfts.find((nft) => nft.name === state?.nftName);

  const storedTheme = useAppSelector(selectTheme);
  const isDarkMode = storedTheme === themeType.DARK;

  const [isLinked, setIsLinked] = useState(!!currentNft?.aas.linked);

  const transferNft = () => {
    if (currentNft?.aas?.linked) {
      setAlert(
        errorAlertShell('NSRecordWarning', { nftName: currentNft?.name || '' })
      );
      return;
    }
    history.push({
      pathname: akashicPayPath(urls.nftTransfer),
      state: history.location.state,
    });
  };

  return (
    <DashboardLayout>
      <IonGrid>
        {!currentNft && (
          <IonRow
            className="ion-justify-content-center"
            style={{ marginTop: '25vh' }}
          >
            <IonCol size={'12'} className="ion-center">
              <AlertIcon />
            </IonCol>
            <IonCol size={'12'} className="ion-center">
              <NoNtfText>{t('NoData')}</NoNtfText>
            </IonCol>
          </IonRow>
        )}
        {currentNft && (
          <>
            <div
              style={{
                backgroundColor: 'var(--nft-header-background)',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '160px',
              }}
            />
            <IonRow>
              <IonCol size="10" offset="1">
                <OneNft
                  nft={currentNft}
                  isAASDarkStyle={!isDarkMode}
                  isLinked={isLinked}
                />
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-top-xs ion-margin-bottom-xxs">
              <IonCol size="10" offset="1">
                <PrimaryButton
                  disabled={!isSendAllowed}
                  expand="block"
                  onClick={transferNft}
                >
                  {t('Transfer')}
                </PrimaryButton>
              </IonCol>
              <IonCol size="10" offset="1">
                <AasListingSwitch
                  nft={currentNft}
                  setAlert={setAlert}
                  setParentLinkage={setIsLinked}
                />
              </IonCol>
            </IonRow>
            <CustomAlert state={alert} />
          </>
        )}
      </IonGrid>
    </DashboardLayout>
  );
}
