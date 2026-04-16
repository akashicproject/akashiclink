import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import type { DepositChainOption } from '../../../utils/hooks/useAccountL1Address';
import type { AddressBookContact } from '../../../utils/hooks/useAddressBook';
import { displayLongText } from '../../../utils/long-text';
import { getNetworkColor } from './address-book-utils';

const ContactItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 0',
  borderBottom: '1px solid var(--ion-color-step-150)',
  cursor: 'pointer',
  '&:last-of-type': {
    borderBottom: 'none',
  },
});

const ContactInfo = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  whiteSpace: 'nowrap',
});

const ContactNameRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

const NetworkLabel = styled.span<{ color: string }>(({ color }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color,
}));

const Dot = styled.span({
  fontSize: '0.875rem',
  color: 'var(--ion-color-on-surface-light)',
});

const ContactName = styled.span({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--ion-color-primary-10)',
});

const ContactAddress = styled.span({
  fontSize: '0.75rem',
  color: '#958e99',
  marginTop: '2px',
});

function getNetworkLabel(
  network: DepositChainOption,
  t: (key: string) => string
): string {
  return network === 'AkashicChain'
    ? t('Chain.AkashicChain')
    : t(`Chain.${network.toUpperCase()}`);
}

export function SavedAddressItem({
  contact,
  onClick,
}: {
  contact: AddressBookContact;
  onClick: () => void;
}) {
  const { t } = useTranslation();

  return (
    <ContactItem onClick={onClick}>
      <ContactInfo>
        <ContactNameRow>
          <NetworkLabel color={getNetworkColor(contact.network)}>
            {getNetworkLabel(contact.network, t)}
          </NetworkLabel>
          <Dot>&middot;</Dot>
          <ContactName>{contact.name}</ContactName>
        </ContactNameRow>
        <ContactAddress>
          {displayLongText(contact.address, 40, false, true)}
        </ContactAddress>
      </ContactInfo>
    </ContactItem>
  );
}
