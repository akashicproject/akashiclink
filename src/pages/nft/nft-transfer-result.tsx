import { IonCol, IonImg, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/buttons';
import { DividerDivWithoutMargin } from '../../components/layout/divider';
import { NftLayout } from '../../components/layout/nft-layout';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
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
}

interface Props {
  transaction: TransferResultType | undefined;
  errorMsg: string;
}

export function NftTransferResult(props: Props) {
  const { t } = useTranslation();
  const wrongResult = props.errorMsg !== errorMsgs.NoError;
  return (
    <NftLayout noFooter={true}>
      <IonRow>
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
              {wrongResult ? props.errorMsg : t('TransactionSuccessful')}
            </HeaderTitle>
            <DividerDivWithoutMargin />
          </HeaderWrapper>
        </IonCol>
      </IonRow>
      {wrongResult ? null : (
        <IonRow style={{ marginTop: '50px' }}>
          <IonCol class="ion-center">
            <ResultContent>
              <TextWrapper>
                <TextTitle>{t('Sender')}</TextTitle>
                <TextContent>
                  {displayLongText(props.transaction?.sender || '')}
                </TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('Receiver')}</TextTitle>
                <TextContent>
                  {displayLongText(props.transaction?.receiver)}
                </TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('NftName')}</TextTitle>
                <TextContent>{props.transaction?.nftName}</TextContent>
              </TextWrapper>
              <TextWrapper>
                <TextTitle>{t('Fee')}</TextTitle>
                <TextContent>{'N/A'}</TextContent>
              </TextWrapper>
            </ResultContent>
          </IonCol>
        </IonRow>
      )}
      <IonRow style={{ marginTop: '50px', width: '270px' }}>
        <IonCol>
          <PurpleButton expand="block" routerLink={akashicPayPath(urls.nfts)}>
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </NftLayout>
  );
}
