import './aas-listing-switch.scss';

import styled from '@emotion/styled';
import {
  type IUpdateAcns,
  type IVerifyUpdateAcnsResponse,
  nftErrors,
} from '@helium-pay/backend';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OwnersAPI } from '../../utils/api';
import { useFetchAndRemapAASToAddress } from '../../utils/hooks/useFetchAndRemapAASToAddress';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { signTxBody } from '../../utils/nitr0gen-api';
import { Toggle } from '../common/toggle/toggle';
import { CacheOtkContext } from '../providers/PreferenceProvider';

const AASListSwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 16px;
`;

export const AasListingSwitch = ({
  name,
  aasValue,
  customAlertHandle,
  customAlertMessage,
}: {
  name?: string;
  aasValue?: string;
  customAlertHandle: React.Dispatch<React.SetStateAction<boolean>>;
  customAlertMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { cacheOtk } = useContext(CacheOtkContext);
  const { activeAccount } = useAccountStorage();
  const { mutateNftMe } = useNftMe();
  const { t } = useTranslation();
  const [isListed, setIsListed] = useState<boolean>(!!aasValue);
  const [isLoading, setIsLoading] = useState(false);
  const fetchAndRemapAASToAddress = useFetchAndRemapAASToAddress();

  const updateAASList = async () => {
    try {
      setIsLoading(true);
      if (name && activeAccount?.identity) {
        const newValue = !isListed ? activeAccount.identity : null;
        const verifyUpdateAcnsResponse: IVerifyUpdateAcnsResponse =
          await OwnersAPI.verifyUpdateAcns({
            name: name,
            newValue: newValue,
          } as IUpdateAcns);

        // "Hack" used when signing nft transactions, identity must be something else than the otk identity
        const signerOtk = {
          ...cacheOtk!,
          identity: verifyUpdateAcnsResponse.nftAcnsStreamId,
        };

        const signedTx = await signTxBody(
          verifyUpdateAcnsResponse.txToSign,
          signerOtk
        );

        await OwnersAPI.updateAcnsUsingClientSideOtk({
          signedTx: signedTx,
          name: name,
          newValue: newValue,
        });
        await fetchAndRemapAASToAddress();
      }
      await mutateNftMe();
      setIsListed(!isListed);
    } catch (error) {
      const errorMsg = axios.isAxiosError(error)
        ? error?.response?.data?.message
        : '';

      if (errorMsg === nftErrors.onlyOneAASLinkingAllowed) {
        customAlertMessage(t('OnlyOneAAS'));
      } else {
        customAlertMessage(
          t('AASLinkingFailed', {
            timeRemaining: errorMsg.split(' ')[0],
            timeUnit: t(errorMsg.split(' ')[1]),
          })
        );
      }
      customAlertHandle(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AASListSwitchContainer>
      <h5 className="ion-no-margin ion-text-size-xxs">{t('linkAlias')}</h5>
      <div className="toggle-wrapper">
        <Toggle
          isLoading={isLoading}
          onClickHandler={updateAASList}
          currentState={isListed ? 'active' : 'inActive'}
        />
      </div>
    </AASListSwitchContainer>
  );
};
