import styled from '@emotion/styled';
import { isPlatform } from '@ionic/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { formatTransfers } from '../../utils/formatTransfers';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';
import { OneActivity } from '../activity/one-activity';
import { TabButton } from '../buttons';
import { Tabs } from './tabs';

const SeeMore = styled(Link)({
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#958E99',
  textDecorationLine: 'underline',
  marginTop: '10px',
  '&:hover': {
    cursor: 'pointer',
  },
});

const NoDataDiv = styled.div({
  fontSize: '16px',
  fontFamily: 'Nunito Sans',
  fontWeight: '700',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
  width: '100%',
  textAlign: 'center',
});

const NoDataWrapper = styled.div({
  height: '100%',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
});

export const ActivityAndNftTab = () => {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const history = useHistory();
  const [transferParams, _] = useState({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().toDate(),
  });
  const { transfers } = useTransfersMe(transferParams);
  const walletFormatTransfers = formatTransfers(transfers);

  return (
    <>
      <Tabs>
        <TabButton
          style={{ width: '50%', marginInline: '0' }}
          id="activity"
          class="open"
          onClick={() => history.push(akashicPayPath(urls.activity))}
        >
          {t('Activity')}
        </TabButton>
        <TabButton
          style={{ width: '50%', marginInline: '0' }}
          id={'nft'}
          onClick={() => history.push(akashicPayPath(urls.nfts))}
        >
          NFT
        </TabButton>
      </Tabs>
      <div
        className="vertical"
        style={{
          alignItems: 'center',
          maxHeight: isMobile ? '200px' : '180px',
        }}
      >
        {walletFormatTransfers.slice(0, 2).map((transfer, index) => {
          return (
            <OneActivity
              key={transfer.id}
              transfer={transfer}
              style={
                index === 0
                  ? { height: '40px', margin: '10px auto 9px' }
                  : { height: '40px', margin: '9px auto 5px' }
              }
              divider={index === 0}
            />
          );
        })}
        {walletFormatTransfers.length >= 1 ? (
          <SeeMore to={akashicPayPath(urls.activity)}>{t('SeeMore')}</SeeMore>
        ) : (
          <NoDataWrapper>
            <NoDataDiv>{t('NoActivity')}</NoDataDiv>
          </NoDataWrapper>
        )}
      </div>
    </>
  );
};
