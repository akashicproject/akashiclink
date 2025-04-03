import './activity.scss';

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { ActivityContainer } from '../../pages/activity/activity-details';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { OneNft } from '../nft/one-nft';
import { BaseDetails } from './base-details';

const StyledNftWrapper = styled.div({
  height: '408px',
  width: '328px',
  margin: 'auto',
  padding: '0',
  ['&:last-child']: {
    marginBottom: '40px',
  },
});

export function NftDetail({
  currentTransfer,
}: {
  currentTransfer: ITransactionRecordForExtension;
}) {
  const { t } = useTranslation();

  if (!currentTransfer.nft) return null;
  return (
    <>
      <StyledNftWrapper>
        <OneNft nft={currentTransfer.nft} isBig={true} />
      </StyledNftWrapper>

      <ActivityContainer>
        <h2 style={{ marginTop: '24px' }}>{t('TransactionDetails')}</h2>
        <BaseDetails currentTransfer={currentTransfer} />
      </ActivityContainer>
    </>
  );
}
