/* eslint-disable sonarjs/no-duplicate-string */
import '../../../components/common/input/styled-input.scss';

import { type ILookForL2Address } from '@akashic/as-backend';
import styled from '@emotion/styled';
import { IonIcon } from '@ionic/react';
import { chevronDown, chevronUp, warningOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertBox } from '../../../components/common/alert/alert';
import { PrimaryButton } from '../../../components/common/buttons';
import { StyledInput } from '../../../components/common/input/styled-input';
import { DashboardLayout } from '../../../components/page-layout/dashboard-layout';
import {
  PageHeader,
  SettingsWrapper,
} from '../../../components/settings/base-components';
import { historyGoBackOrReplace } from '../../../routing/history';
import { OwnersAPI } from '../../../utils/api';
import type { DepositChainOption } from '../../../utils/hooks/useAccountL1Address';
import { useAddressBook } from '../../../utils/hooks/useAddressBook';
import { detectNetworks } from './address-book-utils';

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

export function AddressBookNew() {
  const { t } = useTranslation();
  const { addContact } = useAddressBook();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<DepositChainOption | undefined>();
  const [ambiguousNetworks, setAmbiguousNetworks] = useState<
    DepositChainOption[]
  >([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [resolvedL2Address, setResolvedL2Address] = useState<string>();
  const l2LookupTimer = useRef<ReturnType<typeof setTimeout>>();

  const canSave =
    name.trim() !== '' &&
    address.trim() !== '' &&
    (network !== undefined || !!resolvedL2Address);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setDuplicateError(false);
    setResolvedL2Address(undefined);

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

    // Check if the L1 address belongs to an AC user (debounced)
    clearTimeout(l2LookupTimer.current);
    const isL1 = matches.length >= 1 && !matches.includes('AkashicChain');
    if (isL1 && value.trim()) {
      l2LookupTimer.current = setTimeout(async () => {
        try {
          const results = await Promise.all(
            matches.map((chain) =>
              OwnersAPI.lookForL2Address({
                to: value.trim(),
                coinSymbol: chain as ILookForL2Address['coinSymbol'],
              })
            )
          );
          const match = results.find((r) => !!r.l2Address);
          setResolvedL2Address(match?.l2Address);
        } catch {
          setResolvedL2Address(undefined);
        }
      }, 500);
    }
  };

  useEffect(() => () => clearTimeout(l2LookupTimer.current), []);

  const selectNetwork = (value: DepositChainOption) => {
    setNetwork(value);
    setDropdownOpen(false);
  };

  const handleSave = () => {
    if (!canSave) return;

    const savedNetwork: DepositChainOption = resolvedL2Address
      ? 'AkashicChain'
      : network!;
    const savedAddress = resolvedL2Address ?? address;

    const result = addContact({
      name,
      address: savedAddress,
      network: savedNetwork,
    });

    if (result.success) {
      historyGoBackOrReplace();
      return;
    }

    setDuplicateError(true);
  };

  return (
    <DashboardLayout>
      <SettingsWrapper>
        <PageHeader>{t('AddNewContact')}</PageHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <StyledInput
            label={t('Name')}
            placeholder={t('EnterAName')}
            value={name}
            onIonInput={({ detail: { value } }) => {
              setName(value as string);
              setDuplicateError(false);
            }}
          />
          <StyledInput
            label={t('Address')}
            placeholder={t('EnterAnAddress')}
            value={address}
            onIonInput={({ detail: { value } }) =>
              handleAddressChange(value as string)
            }
          />
          {resolvedL2Address && (
            <AlertBox
              state={{
                success: true,
                visible: true,
                message: 'AddressBookBelongsToL2Warning',
              }}
              customStyle={{
                container: {
                  borderLeft: '8px solid var(--ion-color-primary)',
                  borderTop: '1px solid var(--ion-color-primary)',
                  borderRight: '1px solid var(--ion-color-primary)',
                  borderBottom: '1px solid var(--ion-color-primary)',
                  padding: '8px',
                  justifyContent: 'flex-start',
                  gap: '2px',
                },
                text: {
                  color: 'var(--ion-color-inverse-surface)',
                  textAlign: 'left',
                  margin: 0,
                },
                icon: {
                  color: 'var(--ion-color-primary)',
                },
              }}
              icon={warningOutline}
            />
          )}
          {ambiguousNetworks.length > 1 && !resolvedL2Address && (
            <SelectWrapper>
              <SelectLabel>{t('Chain.Title')}</SelectLabel>
              <SelectTrigger
                isOpen={dropdownOpen}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {network ? (
                  t(`Chain.${network}`)
                ) : (
                  <Placeholder>{t('SelectCurrency')}</Placeholder>
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
                      onClick={() => selectNetwork(chain)}
                    >
                      {t(`Chain.${chain}`)}
                    </OptionItem>
                  ))}
                </OptionsList>
              )}
            </SelectWrapper>
          )}
        </div>
        <PrimaryButton expand="block" onClick={handleSave} disabled={!canSave}>
          {t('Save')}
        </PrimaryButton>
        {duplicateError && (
          <AlertBox
            state={{
              success: false,
              visible: true,
              message: 'AddressBookDuplicateWarningTitle',
              subtitle: 'AddressBookDuplicateWarningSubtitle',
            }}
            customStyle={{
              container: {
                borderLeft: '8px solid var(--ion-color-primary)',
                borderTop: '1px solid var(--ion-color-primary)',
                borderRight: '1px solid var(--ion-color-primary)',
                borderBottom: '1px solid var(--ion-color-primary)',
                padding: '8px',
                justifyContent: 'flex-start',
                gap: '2px',
              },
              text: {
                color: 'var(--ion-color-inverse-surface)',
                textAlign: 'left',
                margin: 0,
              },
              icon: {
                color: 'var(--ion-color-primary)',
              },
            }}
            icon={warningOutline}
          />
        )}
      </SettingsWrapper>
    </DashboardLayout>
  );
}
