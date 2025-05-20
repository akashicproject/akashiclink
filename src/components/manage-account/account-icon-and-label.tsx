import styled from '@emotion/styled';
import { IonItem } from '@ionic/react';

export const IconAndLabel = styled(IonItem)<{
  forceLightMode?: boolean;
  isTrigger?: boolean;
}>(({ forceLightMode, isTrigger }) => ({
  '--padding-start': 0,
  ['ion-button']: {
    borderRadius: '100%',
    margin: 0,
  },
  ['ion-label']: {
    paddingLeft: 4,
    paddingRight: 4,
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
    ['&:active, &:focus, &:hover']: {
      ...(isTrigger && { background: 'rgba(89, 89, 146, 0.08)' }),
    },
  },
  ['&:last-of-kind .item-inner']: {
    border: 0,
  },
  ['&::part(native)']: {
    background: 'transparent',
    ['&:active, &:focus, &:hover']: {
      ...(!isTrigger && { background: 'rgba(89, 89, 146, 0.08)' }),
    },
  },
}));
