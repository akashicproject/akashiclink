import styled from '@emotion/styled';
import { IonItem } from '@ionic/react';

export const IconAndLabel = styled(IonItem)<{ forceLightMode?: boolean }>(
  ({ forceLightMode }) => ({
    '--padding-start': 0,
    ['ion-label']: {
      ['h3']: {
        marginBottom: 0,
        fontWeight: 700,
        ...(forceLightMode && { color: 'var(--ion-color-on-primary)' }),
      },
      ['p']: {
        fontSize: '0.625rem',
        lineHeight: '1rem',
        overflowWrap: 'anywhere',
        ...(forceLightMode && { color: 'var(--ion-color-grey)' }),
      },
    },
    ['&:last-of-kind .item-inner']: {
      border: 0,
    },
    ['&::part(native)']: {
      background: 'transparent',
    },
  })
);
