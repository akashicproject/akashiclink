import { L2Regex, NetworkDictionary } from '@akashic/as-backend';
import styled from '@emotion/styled';
import type { InputCustomEvent } from '@ionic/react';
import {
  IonButton,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { debounce } from 'lodash';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { OwnersAPI } from '../../../utils/api';
import { getErrorMessageTKey } from '../../../utils/error-utils';
import { useAccountStorage } from '../../../utils/hooks/useLocalAccounts';
import { useOwnerKeys } from '../../../utils/hooks/useOwnerKeys';
import {
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../common/alert/alert';
import { StyledInput } from '../../common/input/styled-input';
import { SendFormContext } from '../send-modal-context-provider';
import type { ValidatedAddressPair } from './types';

const LockedAddress = styled(IonItem)({
  ['&::part(native)']: {
    color: 'var(--ion-color-primary)',
    borderColor: 'var(--ion-color-primary)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    fontSize: '0.75rem',
    '--inner-padding-end': '8px',
  },
});

export const SendAddressInput = ({
  validatedAddressPair,
  onAddressValidated,
  onAddressReset,
}: {
  validatedAddressPair: ValidatedAddressPair;
  onAddressValidated: (addresses: ValidatedAddressPair) => void;
  onAddressReset: () => void;
}) => {
  const { t } = useTranslation();

  const [alert, setAlert] = useState(formAlertResetState);
  const { activeAccount } = useAccountStorage();
  const {
    currency: { coinSymbol },
  } = useContext(SendFormContext);
  const addresses = useOwnerKeys(activeAccount?.identity ?? '').keys;

  const validateAddress = debounce(async (input: string) => {
    setAlert(formAlertResetState);

    const userInput = input.trim();

    if (!userInput) return;

    // Not allow sending to self address
    if (
      userInput === activeAccount?.identity ||
      addresses.find((a) => a.address === userInput) ||
      userInput === activeAccount?.alias
    ) {
      setAlert(errorAlertShell('NoSelfSend'));
      return;
    }

    try {
      const { l2Address, alias, isBp, ledgerId } =
        await OwnersAPI.lookForL2Address({
          to: userInput,
          coinSymbol,
        });

      // Not allow sending BP by alias
      if (userInput === alias && isBp) {
        setAlert(errorAlertShell('SendBpByAlias'));
        return;
      }

      if (RegExp(NetworkDictionary[coinSymbol].regex.address).exec(userInput)) {
        // Sending by L1 address
        onAddressValidated({
          alias,
          convertedToAddress: l2Address ?? userInput,
          userInputToAddress: userInput,
          userInputToAddressType: 'l1',
          ...(l2Address && {
            initiatedToNonL2: userInput,
            isL2: true,
          }),
          initiatedToL1LedgerId: ledgerId,
        });
        return;
      } else if (RegExp(L2Regex).exec(userInput)) {
        // Sending L2 by L2 address
        if (!l2Address) {
          setAlert(errorAlertShell('invalidL2Address'));
        } else {
          onAddressValidated({
            alias,
            convertedToAddress: l2Address,
            userInputToAddress: userInput,
            userInputToAddressType: 'l2',
            isL2: true,
          });
        }
        return;
      } else if (!l2Address) {
        // Sending by alias
        setAlert(errorAlertShell('AddressHelpText'));
        return;
      } else {
        onAddressValidated({
          alias,
          convertedToAddress: l2Address,
          userInputToAddress: userInput,
          userInputToAddressType: 'alias',
          isL2: true,
          initiatedToNonL2: userInput,
        });
      }
    } catch (error) {
      setAlert(errorAlertShell(getErrorMessageTKey(error)));
    }
  }, 500);

  const onAddressChange = (e: InputCustomEvent) => {
    if (typeof e.target?.value === 'string') {
      validateAddress(e.target.value);
    }
  };

  const onAddressClear = () => {
    onAddressReset();
  };

  return (
    <IonRow className={'ion-center ion-grid-row-gap-xxs'}>
      <IonCol className={'ion-text-align-center'} size={'12'}>
        <IonText>
          <h2 className="ion-margin-bottom-0 ion-margin-top-md">
            {t('SendTo')}
          </h2>
        </IonText>
      </IonCol>
      <IonCol size={'12'}>
        {validatedAddressPair.userInputToAddress === '' && (
          <StyledInput
            placeholder={t('EnterAddress')}
            type={'text'}
            onIonInput={onAddressChange}
          />
        )}
        {validatedAddressPair.userInputToAddress !== '' && (
          <LockedAddress lines="full">
            <IonLabel className="ion-text-bold">
              {validatedAddressPair.userInputToAddress}
            </IonLabel>
            <IonButton onClick={onAddressClear} fill="clear" slot="end">
              <IonIcon slot="icon-only" icon={closeOutline}></IonIcon>
            </IonButton>
          </LockedAddress>
        )}
      </IonCol>
      {alert.visible && (
        <IonCol size={'12'}>
          <AlertBox state={alert} />
        </IonCol>
      )}
    </IonRow>
  );
};
