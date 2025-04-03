import styled from '@emotion/styled';
import type { JSX } from '@ionic/core/components';
import { IonList } from '@ionic/react';
import type { FC, ReactNode } from 'react';
import React from 'react';

type ListProps = JSX.IonList & {
  bordered?: boolean;
  compact?: boolean;
  children: ReactNode;
};

const StyledList = styled(IonList)<{ bordered: boolean; compact: boolean }>(
  ({ bordered, compact }) => ({
    margin: 0,
    padding: 0,
    borderRadius: 8,
    border: bordered ? `1px solid var(--ion-color-grey)` : 'none',
    ['ion-item']: {
      '--min-height': '28px',
      '--padding-start': bordered ? '16px' : 0,
      '--inner-padding-end': bordered ? '16px' : 0,
      lineHeight: '24px',
    },
    ['ion-label']: {
      marginInline: `0 ${compact ? 2 : 4}px`,
      marginTop: compact ? 2 : 4,
      marginBottom: compact ? 2 : 4,
    },
    ['ion-note']: {
      paddingTop: compact ? 2 : 4,
      paddingBottom: compact ? 2 : 4,
    },
  })
);

export const List: FC<ListProps> = ({
  bordered = false,
  compact = false,
  children,
  ...props
}) => {
  return (
    <StyledList bordered={bordered} compact={compact} {...props}>
      {children}
    </StyledList>
  );
};
