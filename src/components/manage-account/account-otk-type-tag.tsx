import styled from '@emotion/styled';
import { type OtkType } from '@helium-pay/backend';
import { useTranslation } from 'react-i18next';

import { type LocalAccount } from '../../utils/hooks/useLocalAccounts';

const StyledAccountOtkTypeTag = styled.div<{ otkType?: OtkType }>(
  ({ otkType }) => ({
    color: `var(--otk-type-tag-${otkType ?? 'primary'}-text)`,
    background: `var(--otk-type-tag-${otkType ?? 'primary'}-background)`,
    borderRadius: '16px',
    padding: '2px 8px',
  })
);

export const AccountOtkTypeTag = ({
  account,
  className,
}: {
  account: LocalAccount;
  className?: string;
}) => {
  const { t } = useTranslation();

  if (!account?.otkType) return null;

  return (
    <StyledAccountOtkTypeTag
      otkType={account.otkType}
      className={`ion-text-size-xxs ${className}`}
    >
      {t(`OtkType.${account.otkType}`)}
    </StyledAccountOtkTypeTag>
  );
};
