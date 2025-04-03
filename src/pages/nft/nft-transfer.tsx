import styled from '@emotion/styled';
import { L2Regex } from '@helium-pay/owners/src/constants/currencies';
import { IonCol, IonImg, IonRow } from '@ionic/react';
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

const SendWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '24px',
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

export function NftTransfer() {
  const { t } = useTranslation();
  const { nfts } = useNftMe();
  const { owner } = useOwner();
  const [_, __, nftName] = useLocalStorage('nft', nfts[0].name);
  const currentNft = nfts.find((nft) => nft.name === nftName) || nfts[0];
  const [inputUsername, setInputUsername] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [searched, setSearched] = useState(false);

  // Keeps track of which page the user is at
  const [pageView, setPageView] = useState(TransferView.Transfer);
  const [alert, setAlert] = useState(formAlertResetState);
  const [transferResult, setTransferResult] = useState<TransferResultType>();

  // input username to address
  // TODO: we need to add more check constraint in the future, like l2 address start with "AS"
  const inputToAddress = async (value: string) => {
    const searchResult = await OwnersAPI.checkL2Address({
      to: value,
    });
    if (searchResult && value.match(L2Regex)) {
      setToAddress(searchResult);
      setSearched(true);
    } else {
      // Check if anything found by Acns
      const acnsResult = await OwnersAPI.checkL2AddressByAcns({ to: value });
      if (acnsResult) {
        setToAddress(acnsResult);
        setSearched(true);
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
      <Alert state={alert} />
      {pageView === TransferView.Transfer && (
        <NftLayout>
          <IonRow style={{ marginTop: '50px' }}>
            <IonCol class="ion-center">
              <OneNft nft={currentNft} />
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '40px' }}>
            <IonCol class="ion-center">
              <SendWrapper>
                <StyledInput
                  isHorizontal={true}
                  label={t('SendTo')}
                  placeholder={t('EnterAddress')}
                  type={'text'}
                  errorPrompt={StyledInputErrorPrompt.Address}
                  onIonInput={({ target: { value } }) => {
                    debouncedSearchHandler(value as string);
                    setInputUsername(value as string);
                  }}
                />
                <AddressWrapper>
                  {inputUsername && inputUsername !== toAddress && (
                    <AddressBox>
                      {searched
                        ? `${inputUsername} = ${displayLongText(toAddress)}`
                        : t('NoSearchResult')}
                    </AddressBox>
                  )}
                  {!inputUsername ? null : (
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
            style={{ marginTop: '40px', width: '280px' }}
          >
            <IonCol>
              <PurpleButton
                expand="block"
                disabled={!inputUsername || !searched}
                onClick={transferNft}
              >
                {t('Send')}
              </PurpleButton>
            </IonCol>
            <IonCol>
              <WhiteButton expand="block" routerLink={akashicPayPath(urls.nft)}>
                {t('Cancel')}
              </WhiteButton>
            </IonCol>
          </IonRow>
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
