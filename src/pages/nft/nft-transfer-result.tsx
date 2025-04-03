import styled from '@emotion/styled';
import { IonCol, IonRow, isPlatform } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton } from '../../components/common/buttons';
import { Divider } from '../../components/common/divider';
import { ErrorIconWithTitle } from '../../components/common/state-icon-with-title/error-icon-with-title';
import { SuccessfulIconWithTitle } from '../../components/common/state-icon-with-title/successful-icon-with-title';
import { NftLayout } from '../../components/page-layout/nft-layout';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
import type { LocationState } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { displayLongText } from '../../utils/long-text';

// TODO: refactor all these with List
export const ResultContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: '8px',
  width: '100%',
});

export const TextWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px',
  minHeight: '24px',
  width: '100%',
});

export const TextTitle = styled.div({
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
  display: 'flex',
  flexDirection: 'column',
});

export const TextContent = styled.div({
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
});

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
  const { mutateNftTransfersMe } = useNftTransfersMe();
  const history = useHistory<LocationState>();
  const state = history.location.state?.nftTransferResult;
  const wrongResult = state?.errorMsg !== errorMsgs.NoError;
  const isMobile = isPlatform('mobile');
  return (
    <NftLayout noFooter={true}>
      <IonRow style={{ marginTop: isMobile ? '6rem' : '0' }}>
        <IonCol size={'12'} className={'ion-center'}>
          {wrongResult ? (
            <ErrorIconWithTitle title={state?.errorMsg ?? ''} />
          ) : (
            <SuccessfulIconWithTitle title={t('TransactionSuccessful')} />
          )}
        </IonCol>
      </IonRow>
      <Divider style={{ width: '270px' }} />
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
          <PurpleButton
            expand="block"
            routerLink={akashicPayPath(urls.nfts)}
            onClick={async () => {
              await mutateNftTransfersMe();
            }}
          >
            {t('Ok')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </NftLayout>
  );
}
