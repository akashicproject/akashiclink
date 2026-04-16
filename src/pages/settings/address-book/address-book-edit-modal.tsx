import styled from '@emotion/styled';
import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  OutlineButton,
  PrimaryButton,
} from '../../../components/common/buttons';
import { StyledInput } from '../../../components/common/input/styled-input';
import type { DepositChainOption } from '../../../utils/hooks/useAccountL1Address';
import type { AddressBookContact } from '../../../utils/hooks/useAddressBook';
import { detectNetworks } from './address-book-utils';

const PRIMARY_COLOR = '--ion-color-primary';

const ModalContent = styled.div({
  padding: '28px 24px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  height: '100%',
  boxSizing: 'border-box',
});

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  marginBottom: '4px',
});

const ModalBackButton = styled(IonButton)({
  position: 'absolute',
  left: 0,
  marginLeft: -8,
  width: 32,
  height: 32,
  '--padding-start': 0,
  '--padding-end': 0,
});

const ModalTitle = styled.h2({
  flex: 1,
  textAlign: 'center',
  fontSize: '1.125rem',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
  margin: 0,
});

const ModalFormFields = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const ErrorText = styled.span({
  fontSize: '0.75rem',
  color: 'var(--ion-color-danger)',
  paddingLeft: '16px',
});

const SelectWrapper = styled.div({
  width: '100%',
});

const SelectLabel = styled.label({
  display: 'block',
  fontFamily: "'Nunito Sans', serif",
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--ion-color-primary-10)',
  marginBottom: '8px',
});

const SelectTrigger = styled.button<{ isOpen: boolean }>(({ isOpen }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  background: 'transparent',
  border: '1px solid #958e99',
  borderRadius: isOpen ? '8px 8px 0 0' : '8px',
  cursor: 'pointer',
  color: 'var(--ion-color-primary-10)',
  fontSize: '0.75rem',
  fontWeight: 700,
  minHeight: '40px',
}));

const Placeholder = styled.span({
  fontWeight: 400,
  color: 'var(--ion-color-step-400)',
});

const OptionsList = styled.div({
  background: 'var(--ion-background-color)',
  border: '1px solid #958e99',
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
  overflow: 'hidden',
});

const OptionItem = styled.button({
  width: '100%',
  padding: '12px 16px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  color: 'var(--ion-color-primary-10)',
  fontSize: '0.75rem',
  fontWeight: 700,
  '&:hover': {
    background: 'var(--ion-color-step-50)',
  },
});

const ModalDivider = styled.hr({
  border: 'none',
  borderTop: '1px solid var(--ion-item-alt-border-color)',
  margin: '16px 0',
});

const DeleteButton = styled.button({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: `var(${PRIMARY_COLOR})`,
  fontSize: '1rem',
  fontWeight: 600,
  textAlign: 'center',
  padding: '4px 0',
  width: '100%',
});

const ModalButtonRow = styled.div({
  display: 'flex',
  gap: '12px',
  marginTop: 'auto',
});

export interface EditContactModalProps {
  isOpen: boolean;
  contact: AddressBookContact | null;
  onClose: () => void;
  onSave: (
    original: AddressBookContact,
    updated: { name: string; address: string; network: DepositChainOption }
  ) => { success: boolean; error?: string; conflictName?: string };
  onDelete: (network: DepositChainOption, address: string) => void;
}

export function EditContactModal({
  isOpen,
  contact,
  onClose,
  onSave,
  onDelete,
}: EditContactModalProps) {
  const { t } = useTranslation();

  const [name, setName] = useState(contact?.name ?? '');
  const [address, setAddress] = useState(contact?.address ?? '');
  const [network, setNetwork] = useState<DepositChainOption | undefined>(
    contact?.network
  );
  const [ambiguousNetworks, setAmbiguousNetworks] = useState<
    DepositChainOption[]
  >([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [addressError, setAddressError] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setAddress(contact.address);
      setNetwork(contact.network);
      setAmbiguousNetworks([]);
      setDropdownOpen(false);
      setNameError(undefined);
      setAddressError(undefined);
    }
  }, [contact]);

  const canSave =
    name.trim() !== '' && address.trim() !== '' && network !== undefined;

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setAddressError(undefined);

    const matches = detectNetworks(value);

    if (matches.length === 1) {
      setNetwork(matches[0]);
      setAmbiguousNetworks([]);
      setDropdownOpen(false);
    } else if (matches.length > 1) {
      setNetwork(undefined);
      setAmbiguousNetworks(matches);
    } else {
      setNetwork(undefined);
      setAmbiguousNetworks([]);
      setDropdownOpen(false);
    }
  };

  const handleSave = () => {
    if (!canSave || !contact) return;

    const result = onSave(contact, { name, address, network });

    if (result.success) {
      onClose();
      return;
    }

    if (result.error === 'name') {
      setNameError(t('AddressBookNameAlreadyInUse'));
    } else {
      setAddressError(
        t('AddressBookAddressAlreadySaved', { name: result.conflictName })
      );
    }
  };

  const handleDelete = () => {
    if (!contact) return;
    onDelete(contact.network, contact.address);
    onClose();
  };

  return (
    <IonModal
      isOpen={isOpen}
      initialBreakpoint={0.95}
      breakpoints={[0, 0.95]}
      onIonModalDidDismiss={onClose}
      style={{
        '--border-radius': '24px',
        '--background': 'var(--ion-background-color)',
      }}
    >
      <div style={{ height: '95dvh', overflow: 'hidden' }}>
        {contact && (
          <ModalContent>
            <ModalHeader>
              <ModalBackButton size="small" fill="clear" onClick={onClose}>
                <IonIcon
                  slot="icon-only"
                  src="/shared-assets/images/arrow-back.svg"
                />
              </ModalBackButton>
              <ModalTitle>{t('EditContact')}</ModalTitle>
            </ModalHeader>
            <ModalFormFields>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <StyledInput
                  label={t('Name')}
                  placeholder={t('EnterAName')}
                  value={name}
                  isValid={nameError === undefined}
                  onIonInput={({ detail: { value } }) => {
                    setName(value as string);
                    setNameError(undefined);
                  }}
                />
                {nameError && <ErrorText>{nameError}</ErrorText>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <StyledInput
                  label={t('Address')}
                  placeholder={t('EnterAnAddress')}
                  value={address}
                  isValid={addressError === undefined}
                  onIonInput={({ detail: { value } }) =>
                    handleAddressChange(value as string)
                  }
                />
                {addressError && <ErrorText>{addressError}</ErrorText>}
              </div>
              {ambiguousNetworks.length > 1 && (
                <SelectWrapper>
                  <SelectLabel>{t('Chain.Title')}</SelectLabel>
                  <SelectTrigger
                    isOpen={dropdownOpen}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    {network ? (
                      t(`Chain.${network}`)
                    ) : (
                      <Placeholder>{t('SelectNetwork')}</Placeholder>
                    )}
                    <IonIcon
                      icon={dropdownOpen ? chevronUp : chevronDown}
                      style={{ fontSize: '1rem', flexShrink: 0 }}
                    />
                  </SelectTrigger>
                  {dropdownOpen && (
                    <OptionsList>
                      {ambiguousNetworks.map((chain) => (
                        <OptionItem
                          key={chain}
                          onClick={() => {
                            setNetwork(chain);
                            setDropdownOpen(false);
                          }}
                        >
                          {t(`Chain.${chain}`)}
                        </OptionItem>
                      ))}
                    </OptionsList>
                  )}
                </SelectWrapper>
              )}
            </ModalFormFields>
            <ModalDivider />
            <DeleteButton onClick={handleDelete}>
              {t('DeleteFromAddressBook')}
            </DeleteButton>
            <ModalButtonRow>
              <PrimaryButton
                expand="block"
                onClick={handleSave}
                disabled={!canSave}
                style={{ flex: 1 }}
              >
                {t('Save')}
              </PrimaryButton>
              <OutlineButton
                expand="block"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                {t('Cancel')}
              </OutlineButton>
            </ModalButtonRow>
          </ModalContent>
        )}
      </div>
    </IonModal>
  );
}
