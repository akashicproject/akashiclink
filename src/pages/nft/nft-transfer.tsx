import styled from '@emotion/styled';
import { L2Regex } from '@helium-pay/backend';
import {
  IonCol,
  IonIcon,
  IonImg,
  IonRow,
  IonSpinner,
  isPlatform,
} from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { NftLayout } from '../../components/layout/nft-layout';
import { OneNft } from '../../components/nft/one-nft';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { OwnersAPI } from '../../utils/api';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { useOwner } from '../../utils/hooks/useOwner';
import { displayLongText } from '../../utils/long-text';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import type { TransferResultType } from './nft-transfer-result';
import { NftTransferResult } from './nft-transfer-result';
import { NoNtfText, NoNtfWrapper } from './nfts';

const SendWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  minHeight: '156px',
  width: '270px',
});

const AddressWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0',
  gap: '16px',
  width: '270px',
  height: '28px',
});

const AddressBox = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  width: '270px',
  height: '40px',
  borderRadius: '8px',
  fontFamily: 'Nunito Sans',
  fontWeight: '400',
  fontSize: '12px',
  lineHeight: '16px',
  color: '#290056',
  border: '1px solid #958e99',
});

const FeeMarker = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '6px 16px',
  gap: '8px',
  width: '270px',
  height: '28px',
  borderRadius: '8px',
  fontFamily: 'Nunito Sans',
  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '16px',
  border: '1px solid #958E99',
  color: 'var(--ion-color-primary-10)',
});

/** Corresponds to steps taken by user as they make a nft transfer */
enum TransferView {
  Transfer = 'Transfer',
  Result = 'Result',
}

enum SearchResult {
  Layer2 = 'Layer2',
  AcnsName = 'AcnsName',
  NoResult = 'NoResult',
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function NftTransfer() {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const { nfts, isLoading, mutate } = useNftMe();
  const { owner } = useOwner();
  const [nftName, _] = useLocalStorage('nft', '');
  const currentNft = nfts.find((nft) => nft.name === nftName) || nfts[0];
  const [inputValue, setInputValue] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [searched, setSearched] = useState(false);
  const [searchedResultType, setSearchedResultType] = useState(
    SearchResult.NoResult
  );

  // Keeps track of which page the user is at
  const [pageView, setPageView] = useState(TransferView.Transfer);
  const [alert, setAlert] = useState(formAlertResetState);
  const [transferResult, setTransferResult] = useState<TransferResultType>();
  const [loading, setLoading] = useState(false);

  // input username to address
  // TODO: we need to add more check constraint in the future, like l2 address start with "AS"
  const inputToAddress = async (value: string) => {
    if (value === '') {
      setToAddress('');
      setSearched(false);
      setSearchedResultType(SearchResult.NoResult);
    }
    const searchResult = await OwnersAPI.checkL2Address({
      to: value,
    });
    if (searchResult && value.match(L2Regex)) {
      setToAddress(searchResult);
      setSearchedResultType(SearchResult.Layer2);
      setSearched(true);
    } else {
      const acnsResult = await OwnersAPI.nftSearch({ searchValue: value });
      if (acnsResult.value) {
        setSearched(true);
        setToAddress(acnsResult.value);
        setSearchedResultType(SearchResult.AcnsName);
      } else {
        setSearched(false);
      }
    }
  };

  const transferNft = async () => {
    await mutate(async () => {
      const payload = {
        nftName: currentNft.name,
        toL2Address: toAddress,
      };
      setLoading(true);
      try {
        const response = await OwnersAPI.nftTransfer(payload);
        const result = {
          sender: owner.ownerIdentity,
          receiver: toAddress,
          nftName: response.nftName,
        };
        setTransferResult(result);
        setPageView(TransferView.Result);
      } catch (error) {
        setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
      } finally {
        setLoading(false);
      }
    });
  };

  const debouncedSearchHandler = useMemo(
    () => debounce(inputToAddress, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearchHandler.cancel();
    };
  }, []);
  return (
    <>
      <Alert state={alert} />
      {isLoading && (
        <NoNtfWrapper>
          <IonSpinner name="circular"></IonSpinner>
        </NoNtfWrapper>
      )}
      {pageView === TransferView.Transfer && (
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
            <>
              <IonRow style={{ marginTop: isMobile ? '50px' : '40px' }}>
                <IonCol class="ion-center">
                  <OneNft nft={currentNft} />
                </IonCol>
              </IonRow>
              <IonRow style={{ marginTop: isMobile ? '40px' : '20px' }}>
                <IonCol class="ion-center">
                  <SendWrapper style={{ gap: isMobile ? '24px' : '16px' }}>
                    <StyledInput
                      isHorizontal={true}
                      label={t('SendTo')}
                      placeholder={t('EnterAddress')}
                      type={'text'}
                      errorPrompt={StyledInputErrorPrompt.Address}
                      onIonInput={({ target: { value } }) => {
                        debouncedSearchHandler(value as string);
                        setInputValue(value as string);
                      }}
                    />
                    <AddressWrapper>
                      {inputValue && (
                        <AddressBox>
                          {searchedResultType === SearchResult.AcnsName &&
                            `${inputValue} = ${displayLongText(toAddress)}`}
                          {searchedResultType === SearchResult.Layer2 &&
                            `${displayLongText(toAddress)}`}
                          {searchedResultType === SearchResult.NoResult &&
                            t('NoSearchResult')}
                        </AddressBox>
                      )}
                      {!inputValue ? null : (
                        <IonImg
                          alt={''}
                          src={
                            searched
                              ? '/shared-assets/images/right.png'
                              : '/shared-assets/images/wrong.png'
                          }
                          style={{ width: '40px', height: '40px' }}
                        />
                      )}
                    </AddressWrapper>
                    <FeeMarker>{t('Fee')}: 0.001ETH</FeeMarker>
                  </SendWrapper>
                </IonCol>
              </IonRow>
              <IonRow
                class="ion-justify-content-between"
                style={{
                  marginTop: isMobile ? '40px' : '10px',
                  width: '280px',
                }}
              >
                <IonCol>
                  <PurpleButton
                    expand="block"
                    disabled={!inputValue || !searched}
                    onClick={transferNft}
                  >
                    {t('Send')}
                    {loading ? (
                      <IonSpinner style={{ marginLeft: '10px' }}></IonSpinner>
                    ) : null}
                  </PurpleButton>
                </IonCol>
                <IonCol>
                  <WhiteButton
                    expand="block"
                    routerLink={akashicPayPath(urls.nft)}
                  >
                    {t('Cancel')}
                  </WhiteButton>
                </IonCol>
              </IonRow>
            </>
          )}
        </NftLayout>
      )}
      {pageView === TransferView.Result && (
        <NftTransferResult
          transaction={transferResult}
          errorMsg={errorMsgs.NoError}
        />
      )}
    </>
  );
}
