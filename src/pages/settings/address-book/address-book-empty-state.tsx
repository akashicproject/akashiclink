import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/common/buttons';
import { urls } from '../../../constants/urls';
import { historyGo } from '../../../routing/history';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
  padding: '24px 8px 24px',
  gap: '12px',
});

const Title = styled.h2({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--ion-text-color)',
  margin: 0,
  textAlign: 'center',
  flexShrink: 0,
});

const Subtitle = styled.p({
  fontSize: '0.875rem',
  color: '#958e99',
  margin: 0,
  textAlign: 'center',
  lineHeight: 1.5,
  marginBottom: 'auto',
  flexShrink: 0,
});

export function AddressBookEmptyState() {
  const { t } = useTranslation();

  return (
    <Container>
      <svg
        style={{ marginTop: 'auto' }}
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M42.6666 29.3333V47.92L29.3333 42.2133L16 47.92V13.3333H32V8H16C13.0666 8 10.6666 10.4 10.6666 13.3333V56L29.3333 48L48 56V29.3333H42.6666ZM53.3333 18.6667H48V24H42.6666V18.6667H37.3333V13.3333H42.6666V8H48V13.3333H53.3333V18.6667Z"
          fill="#E2DFFF"
        />
      </svg>
      <Title>{t('AddressBookEmptyTitle')}</Title>
      <Subtitle>{t('AddressBookEmptySubtitle')}</Subtitle>
      <PrimaryButton
        expand="block"
        style={{ width: '100%', marginTop: 'auto' }}
        onClick={() => historyGo(urls.addressBookNew)}
      >
        {t('AddAddress')}
      </PrimaryButton>
    </Container>
  );
}
