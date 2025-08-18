import styled from '@emotion/styled';
import { IonButton, IonIcon } from '@ionic/react';
import { caretDownOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';

import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { displayLongText } from '../../utils/long-text';
import { AccountOtkTypeTag } from '../manage-account/account-otk-type-tag';
import { ManageAccountsModal } from '../manage-account/manage-accounts-modal';

export const StyledAccountSelector = styled(IonButton)({
  '--min-height': 'auto',
  margin: 0,
  flex: 1,
  ['&::part(native)']: {
    color: 'var(--ion-color-primary-10)',
    '--border-color': '#7b757f',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: '0.75rem',
    '--inner-padding-end': '8px',
    '--padding-start': '8px',
    '--padding-top': '8px',
    '--padding-bottom': '8px',
    height: 40,
    marginInlineStart: 0,
    background: 'transparent',
    textWrap: 'wrap',
    textTransform: 'none',
  },
});

export function AccountSelection({ isPopup = false }: { isPopup?: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  const { activeAccount } = useAccountStorage();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
      }}
    >
      <StyledAccountSelector
        onClick={() => {
          setShowModal(true);
        }}
      >
        {activeAccount &&
          `${
            activeAccount.alias ?? activeAccount?.accountName ?? `Account`
          } - ${displayLongText(activeAccount.identity, 20, true)}`}
        {activeAccount && (
          <AccountOtkTypeTag
            className={'ion-margin-left-xxs ion-margin-right-xxs'}
            account={activeAccount}
          />
        )}
        <IonIcon
          className={'ion-margin-left-auto'}
          slot="end"
          icon={caretDownOutline}
        />
      </StyledAccountSelector>
      <ManageAccountsModal
        modal={modal}
        isOpen={showModal}
        setIsOpen={setShowModal}
        isPopup={isPopup}
      />
    </div>
  );
}
