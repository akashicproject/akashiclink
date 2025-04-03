import { IonCol, IonImg, IonRow, isPlatform } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton } from '../../components/buttons';
import { DividerDiv } from '../../components/layout/divider';
import { NftLayout } from '../../components/layout/nft-layout';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../history';
import { akashicPayPath } from '../../routing/navigation-tree';
import { displayLongText } from '../../utils/long-text';
import {
  HeaderTitle,
  HeaderWrapper,
  ResultContent,
  TextContent,
  TextTitle,
  TextWrapper,
} from '../send/send-result';

// TODO: should use ITransferNftResponse instead
export interface TransferResultType {
  sender: string | null | undefined;
  receiver: string;
  nftName: string;
  acnsAlias: string;
  txHash?: string;
}

export function NftTransferResult() {
  const { t } = useTranslation();
  const history = useHistory<LocationState>();
  const state = history.location.state?.nftTransferResult;
  const wrongResult = state?.errorMsg !== errorMsgs.NoError;
  const isMobile = isPlatform('mobile');
  return (
    <NftLayout noFooter={true} background={false}>
      <IonRow style={{ marginTop: isMobile ? '6rem' : '0' }}>
        <IonCol class="ion-center">
          <HeaderWrapper>
            <IonImg
              alt={''}
              src={
                wrongResult
                  ? '/shared-assets/images/wrong.png'
                  : '/shared-assets/images/right.png'
              }
              style={{ width: '40px', height: '40px' }}
            />
            <HeaderTitle style={{ width: '213px' }}>
              {wrongResult ? state?.errorMsg : t('TransactionSuccessful')}
            </HeaderTitle>
          </HeaderWrapper>
        </IonCol>
      </IonRow>
      <DividerDiv style={{ width: '270px' }} />
      {wrongResult ? null : (
        <IonRow>
          <IonCol class="ion-center">
            <ResultContent>
              <TextWrapper>
                <TextTitle>{t('txHash')}</TextTitle>
                <TextContent>
                  {displayLongText(state?.transaction?.txHash || '')}
                </TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('Sender')}</TextTitle>
                <TextContent>
                  {displayLongText(state?.transaction?.sender || '')}
                </TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('Receiver')}</TextTitle>
                <TextContent>
                  {displayLongText(state?.transaction?.receiver)}
                </TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{'NFT'}</TextTitle>
                <TextContent>{state?.transaction?.acnsAlias}</TextContent>
              </TextWrapper>
            </ResultContent>
          </IonCol>
        </IonRow>
      )}
      <IonRow
        style={{
          width: '270px',
          marginTop: isMobile ? '2.5rem' : '0.5rem',
        }}
      >
        <IonCol>
          <PurpleButton expand="block" routerLink={akashicPayPath(urls.nfts)}>
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </NftLayout>
  );
}
