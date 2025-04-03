import styled from '@emotion/styled';
import { isPlatform } from '@ionic/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

import { urls } from '../../constants/urls';
import { Divider, formatWalletTransfer } from '../../pages/activity';
import { akashicPayPath } from '../../routing/navigation-tree';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';
import { OneActivity } from '../activity/one-activity';
import { TabButton } from '../buttons';

const Tabs = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  height: '40px',
});

const NftDiv = styled.div({
  height: '200px',
});

const ActivityDiv = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '200px',
});

const SeeMore = styled(Link)({
  fontFamily: 'Nunito Sans',
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

export const ActivityAndNftTab = () => {
  const [tab, setTab] = useState('activity');
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const history = useHistory();
  const [transferParams, _] = useState({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().toDate(),
  });
  const { transfers } = useTransfersMe(transferParams);
  const walletFormatTransfers = formatWalletTransfer(transfers);

  return (
    <div>
      <Tabs>
        <TabButton
          style={{ width: '50%', marginInline: '0' }}
          id={'activity'}
          onClick={() => setTab('activity')}
        >
          {t('Activity')}
        </TabButton>
        <TabButton
          style={{ width: '50%', marginInline: '0' }}
          id={'nft'}
          onClick={() => history.push(akashicPayPath(urls.nfts))}
        >
          Nft
        </TabButton>
      </Tabs>
      {tab === 'activity' ? (
        <ActivityDiv style={{ height: isMobile ? '200px' : '180px' }}>
          {walletFormatTransfers.slice(0, 2).map((transfer, index) => {
            return (
              <OneActivity
                key={transfer.id}
                transfer={transfer}
                style={
                  index === 0
                    ? { height: '40px', margin: '30px auto 15px' }
                    : { height: '40px', margin: '10px auto 5px' }
                }
              >
                <Divider />
              </OneActivity>
            );
          })}
          {walletFormatTransfers.length >= 1 ? (
            <SeeMore to={akashicPayPath(urls.activity)}>{t('SeeMore')}</SeeMore>
          ) : null}
        </ActivityDiv>
      ) : (
        <NftDiv style={{ height: isMobile ? '200px' : '180px' }}> nft</NftDiv>
      )}
    </div>
  );
};
