import './switch.css';

import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OwnersAPI } from '../../utils/api';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { Toggle } from '../toggle/toggle';

const StyledIonRow = styled(IonRow)`
  width: 100%;
  align-items: center;
`;
const StyledIonCol = styled(IonCol)`
  font-size: 11px;
  font-weight: 400;
  color: var(--ion-color-primary-10);
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
  customAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { activeAccount } = useAccountStorage();
  const { mutate } = useNftMe();
  const { t } = useTranslation();
  const [isListed, setIsListed] = useState<boolean>(!!aasValue);
  const [isLoading, setIsLoading] = useState(false);
  const updateAASList = async () => {
    try {
      setIsLoading(true);
      if (name) {
        await OwnersAPI.updateAcns({
          name: name,
          newValue: !isListed ? activeAccount!.identity : null,
        });
      }
      await mutate();
      setIsListed(!isListed);
    } catch (error) {
      const errorMsg = axios.isAxiosError(error)
        ? error?.response?.data?.message
        : '';
      customAlertMessage(
        t('AASLinkingFailed', {
          timeRemaining: errorMsg.split(' ')[0],
          timeUnit: t(errorMsg.split(' ')[1]),
        })
      );
      customAlertHandle(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledIonRow hidden={!name} className="link-alias-toggle-row">
      <StyledIonCol offsetMd="3" sizeMd="4" offsetXs={'1'} sizeXs={'7'}>
        {t('linkAlias')}
      </StyledIonCol>
      <IonCol sizeXs="3" sizeMd="2" style={{ padding: '5px' }}>
        <Toggle
          isLoading={isLoading}
          onClickHandler={updateAASList}
          currentState={isListed ? 'active' : 'inActive'}
        />
      </IonCol>
    </StyledIonRow>
  );
};
