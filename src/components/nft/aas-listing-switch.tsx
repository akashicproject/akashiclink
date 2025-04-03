import './switch.css';

import { IonCol, IonRow, IonToggle } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OwnersAPI } from '../../utils/api';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useNftMe } from '../../utils/hooks/useNftMe';

export const AasListingSwitch = ({
  name,
  aasValue,
}: {
  name?: string;
  aasValue?: string;
}) => {
  const { activeAccount } = useAccountStorage();
  const { mutate } = useNftMe();
  const { t } = useTranslation();
  const [isListed, setIsListed] = useState<boolean>(!!aasValue);
  const updateAASList = async () => {
    try {
      setIsListed(!isListed);
      if (name) {
        await OwnersAPI.updateAcns({
          name: name,
          newValue: !isListed ? activeAccount!.identity : null,
        });
      }
    } catch (err) {
      setIsListed(!isListed);
    } finally {
      await mutate();
    }
  };

  return name ? (
    <IonRow>
      <IonCol size={'10'}>{t('linkAlias')}</IonCol>
      <IonCol size="2">
        <IonToggle onIonChange={updateAASList} checked={isListed} />
      </IonCol>
    </IonRow>
  ) : (
    <></>
  );
};
