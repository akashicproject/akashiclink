import styled from '@emotion/styled';
import type { INftResponse } from '@helium-pay/backend';
import { IonBackdrop, isPlatform } from '@ionic/react';
import dayjs from 'dayjs';
import { t } from 'i18next';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import type { GridComponents } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

import { urls } from '../../constants/urls';
import { ActivityDetailComponent } from '../../pages/activity';
import { akashicPayPath } from '../../routing/navigation-tree';
import type { ITransactionRecordForExtension } from '../../utils/formatTransfers';
import { formatTransfers } from '../../utils/formatTransfers';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';
import { OneActivity } from '../activity/one-activity';
import { TabButton } from '../buttons';
import { OneNft } from '../nft/one-nft';
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
  textAlign: 'center',
  width: '100%',
  display: 'block',
  bottom: '2rem',
});
const ListContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-evenly',
}) as GridComponents['List'];

const ItemContainer = styled.div({});
const NoDataDiv = styled.span({
  fontSize: '16px',
  fontFamily: 'Nunito Sans',
  fontWeight: '700',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
  width: '100%',
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
});

const NoDataWrapper = styled.div({
  height: '25vh',
  position: 'relative',
});

export const ActivityAndNftTabComponent = ({
  setNftTab,
  nftTab,
  fromNfts = false,
}: {
  setNftTab: Dispatch<SetStateAction<boolean>>;
  nftTab: boolean;
  fromNfts: boolean;
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <Tabs>
      <TabButton
        style={{ width: '50%', marginInline: '0' }}
        id="activity"
        class={!nftTab ? 'open' : ''}
        onClick={() =>
          !fromNfts
            ? setNftTab(false)
            : history.push(akashicPayPath(urls.activity))
        }
      >
        {t('Activity')}
      </TabButton>
      <TabButton
        style={{ width: '50%', marginInline: '0' }}
        id={'nft'}
        onClick={() => {
          if (!fromNfts) {
            history.push(akashicPayPath(urls.nfts));
          }
        }}
        class={nftTab ? 'open' : ''}
      >
        NFT
      </TabButton>
    </Tabs>
  );
};

export function ActivityAndNftTab() {
  const isMobile = isPlatform('mobile');
  const [transferParams] = useState({
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().toDate(),
  });
  const itemDisplayIndex = 3;
  const history = useHistory();
  const [nftTab, setNftTab] = useState(false);
  const { nfts } = useNftMe();
  const { transfers } = useTransfersMe(transferParams);
  const walletFormatTransfers = formatTransfers(transfers);
  const [_, setNft] = useLocalStorage('nft', '');
  const selectNft = (nft: INftResponse) => {
    setNft(nft.name);
    history.push({
      pathname: akashicPayPath(urls.nft),
      state: {
        nftName: nft.name,
        chainType: nft.chainType,
      },
    });
  };
  const [currentTransfer, setCurrentTransfer] =
    useState<ITransactionRecordForExtension>();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen ? (
        <div style={{ height: '27vh' }}>
          <IonBackdrop />
          <ActivityDetailComponent
            transfer={currentTransfer!}
            setIsOpen={setIsOpen}
          />
        </div>
      ) : (
        <>
          <ActivityAndNftTabComponent
            nftTab={nftTab}
            setNftTab={setNftTab}
            fromNfts={false}
          />
          <div
            className="vertical"
            style={{
              height: isMobile ? '25vh' : '20vh',
              marginTop: '0.8rem',
              overflow: 'auto',
            }}
          >
            {!nftTab &&
              walletFormatTransfers
                .slice(0, itemDisplayIndex - 1)
                .map((transfer, index) => {
                  return (
                    <OneActivity
                      key={transfer.id}
                      transfer={transfer}
                      style={
                        index !== itemDisplayIndex - 1
                          ? { height: '40px', margin: '10px auto 9px' }
                          : { height: '40px', margin: '9px auto 5px' }
                      }
                      divider={index + 1 !== itemDisplayIndex - 1}
                      showDetail={true}
                      onClick={() => {
                        setIsOpen(true);
                        setCurrentTransfer(transfer);
                      }}
                    />
                  );
                })}
            {nftTab && (
              <Virtuoso
                hidden={!nfts.length}
                style={{ overflowY: 'unset', marginTop: '15px' }}
                overscan={900}
                totalCount={nfts.length}
                data={nfts.slice(0, itemDisplayIndex - 1)}
                components={{
                  Item: ItemContainer,
                  List: ListContainer,
                }}
                itemContent={(_index, nft) => (
                  <OneNft
                    isBig={false}
                    nft={nft}
                    select={() => selectNft(nft)}
                  />
                )}
              />
            )}
            <NoDataWrapper>
              <NoDataDiv>
                {nftTab && !nfts.length
                  ? t('DoNotOwnNfts')
                  : !walletFormatTransfers.length && !nftTab && t('NoActivity')}
              </NoDataDiv>
            </NoDataWrapper>
          </div>
          {walletFormatTransfers.length >= itemDisplayIndex && !nftTab && (
            <SeeMore
              style={{ position: 'fixed' }}
              to={akashicPayPath(urls.activity)}
            >
              {t('SeeMore')}
            </SeeMore>
          )}
          {nftTab && nfts.length > itemDisplayIndex && (
            <SeeMore
              style={{ position: 'fixed' }}
              to={akashicPayPath(urls.nfts)}
            >
              {t('SeeMore')}
            </SeeMore>
          )}
        </>
      )}
    </>
  );
}
