import './aas-listing-switch.scss';

import styled from '@emotion/styled';
import {
  type IUpdateAcns,
  type IVerifyUpdateAcnsResponse,
  nftErrors,
} from '@helium-pay/backend';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OwnersAPI } from '../../utils/api';
import { useFetchAndRemapAASToAddress } from '../../utils/hooks/useFetchAndRemapAASToAddress';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { signTxBody } from '../../utils/nitr0gen-api';
import type { FormAlertState } from '../common/alert/alert';
import { errorAlertShell } from '../common/alert/alert';
import { Toggle } from '../common/toggle/toggle';
import { useCacheOtk } from '../providers/PreferenceProvider';

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
  setAlert,
}: {
  name?: string;
  aasValue?: string;
  setAlert: React.Dispatch<React.SetStateAction<FormAlertState>>;
}) => {
  const [cacheOtk, _] = useCacheOtk();
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
          ...cacheOtk,
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
        await fetchAndRemapAASToAddress(activeAccount.identity);
      }
      await mutateNftMe();
      setIsListed(!isListed);
    } catch (error) {
      const errorMsg = axios.isAxiosError(error)
        ? error?.response?.data?.message
        : '';

      if (errorMsg === nftErrors.onlyOneAASLinkingAllowed) {
        setAlert(errorAlertShell('OnlyOneAAS'));
      } else {
        setAlert(
          errorAlertShell('AASLinkingFailed', {
            name,
            timeRemaining: errorMsg.split(' ')[0],
            timeUnit: t(errorMsg.split(' ')[1]),
          })
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AASListSwitchContainer>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h5 className="ion-no-margin ion-text-size-xxs">{t('linkAlias')}</h5>
        <p className={'ion-text-color-grey ion-text-bold ion-text-size-xxs'}>
          {t('unlinkNftWarning')}
        </p>
      </div>
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
