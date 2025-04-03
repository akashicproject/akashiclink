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
import { useHistory } from 'react-router-dom';

import {
  CustomAlert,
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
import type { LocationState } from '../../history';
import { akashicPayPath } from '../../routing/navigation-tree';
import { OwnersAPI } from '../../utils/api';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { useOwner } from '../../utils/hooks/useOwner';
import { displayLongText } from '../../utils/long-text';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { NoNtfText, NoNtfWrapper } from './nfts';

const SendWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  margin: '24px',
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
  color: 'var(--ion-color-primary-10)',
  border: '1px solid #958e99',
});

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
  const history = useHistory<LocationState>();
  const state = history.location.state?.nft;
  const currentNft = nfts.find((nft) => nft.name === state?.nftName)!;
  const [inputValue, setInputValue] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [searched, setSearched] = useState(false);
  const [searchedResultType, setSearchedResultType] = useState(
    SearchResult.NoResult
  );

  const [alert, setAlert] = useState(formAlertResetState);
  const [loading, setLoading] = useState(false);

  // input username to address
  // TODO: we need to add more check constraint in the future, like l2 address start with "AS"
  const inputToAddress = async (value: string) => {
    if (value === '') {
      setToAddress('');
      setSearched(false);
      setSearchedResultType(SearchResult.NoResult);
    }
    const { l2Address } = await OwnersAPI.checkL2Address({
      to: value,
    });
    if (l2Address && value.match(L2Regex)) {
      setToAddress(l2Address);
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
        acnsAlias: response.acnsAlias,
        txHash: response.txHash,
      };
      history.push({
        pathname: akashicPayPath(urls.nftTransferResult),
        state: {
          nftTransferResult: {
            transaction: result,
            errorMsg: errorMsgs.NoError,
          },
        },
      });
    } catch (error) {
      setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
    } finally {
      setInputValue('');
      await mutate();
      setLoading(false);
    }
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
      <CustomAlert state={alert} />
      {isLoading && (
        <NoNtfWrapper>
          <IonSpinner name="circular"></IonSpinner>
        </NoNtfWrapper>
      )}
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
                <OneNft nft={currentNft} isNameHidden={true} />
              </IonCol>
            </IonRow>
            <IonRow>
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
                    value={inputValue}
                  />
                  {inputValue && (
                    <AddressWrapper>
                      <AddressBox>
                        {searchedResultType === SearchResult.AcnsName &&
                          `${inputValue} = ${displayLongText(toAddress)}`}
                        {searchedResultType === SearchResult.Layer2 &&
                          `${displayLongText(toAddress)}`}
                        {searchedResultType === SearchResult.NoResult &&
                          t('NoSearchResult')}
                      </AddressBox>

                      <IonImg
                        alt={''}
                        src={
                          searched
                            ? '/shared-assets/images/right.png'
                            : '/shared-assets/images/wrong.png'
                        }
                        style={{ width: '40px', height: '40px' }}
                      />
                    </AddressWrapper>
                  )}
                </SendWrapper>
              </IonCol>
            </IonRow>
            <IonRow
              class="ion-justify-content-between"
              style={{
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
                <WhiteButton expand="block" onClick={() => history.goBack()}>
                  {t('Cancel')}
                </WhiteButton>
              </IonCol>
            </IonRow>
          </>
        )}
      </NftLayout>
    </>
  );
}
