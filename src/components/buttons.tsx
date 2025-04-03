import type { CSSInterpolation } from '@emotion/serialize/types';
import styled from '@emotion/styled';
import { IonButton } from '@ionic/react';
import type { CSSProperties } from 'react';

const purple = '#7444B6';
const white = '#FFFFFF';

const squareButtonBaseCss: CSSInterpolation = {
  border: '1px solid transparent',
  borderRadius: '6px !important',
  textAlign: 'center',
  height: '40px',
};

const buttonBaseCss: CSSInterpolation = {
  border: '1px solid transparent',
  borderRadius: '100px !important',
  textAlign: 'center',
  height: '40px',
};

const buttonTextBaseCss: CSSInterpolation = {
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  textTransform: 'none',
  transition: 'all ease-in-out 0.3s',
  [':hover']: {
    background: 'rgba(103, 80, 164, 0.14)',
  },
};

const purpleButtonCss: CSSInterpolation = {
  ['&::part(native)']: {
    ...buttonBaseCss,
    background: purple,
    color: white,
    ...buttonTextBaseCss,
  },
};

const whiteButtonBase: CSSInterpolation = {
  background: 'var(--ion-white-button-background)',
  borderColor: '#7B757F',
  color: 'var(--ion-white-button-text)',
  [':active, :focus']: {
    background: 'rgba(103, 80, 164, 0.08)',
  },
};

const whiteButtonCss: CSSInterpolation = {
  ['&::part(native)']: {
    ...buttonBaseCss,
    ...whiteButtonBase,
    ...buttonTextBaseCss,
  },
};

const tabButtonEffectsCss: CSSInterpolation = {
  [':active, :focus, :hover']: {
    borderBottom: '2px solid #C297FF',
    background: 'transparent',
  },
};

const tabButtonCss: CSSInterpolation = {
  ['&::part(native)']: {
    color: 'var(--ion-color-primary-10)',
    background: 'transparent',
    boxShadow: 'none',
    borderBottom: '2px solid #CCC4CF',
    borderRadius: '0',
    ...buttonTextBaseCss,
    ...tabButtonEffectsCss,
  },
};

const bottomTabButton: CSSInterpolation = {
  ['&::part(native)']: {
    color: 'var(--ion-color-primary-10)',
    background: 'transparent',
    borderRadius: 0,
    ...buttonTextBaseCss,
    ...tabButtonEffectsCss,
  },
};

const topTabButton: CSSInterpolation = {
  ['&::part(native)']: {
    color: 'var(--ion-color-primary-10)',
    background: 'transparent',
    borderRadius: 0,
    borderBottom: '2px solid #CCC4CF',
    ...buttonTextBaseCss,
    ...tabButtonEffectsCss,
  },
};

const topTabButtonActive: CSSInterpolation = {
  ['&::part(native)']: {
    color: 'var(--ion-color-primary-10)',
    background: 'transparent',
    borderRadius: 0,
    borderBottom: '2px solid #C297FF',
    ...buttonTextBaseCss,
    ...tabButtonEffectsCss,
  },
};

export const PurpleButton = styled(IonButton)({
  ...purpleButtonCss,
});

export const WhiteButton = styled(IonButton)({
  ...whiteButtonCss,
});

export const SquareWhiteButton = styled(IonButton, {
  shouldForwardProp: (props) => props !== 'forceStyle',
})<{ forceStyle?: CSSProperties }>(({ forceStyle }) => ({
  ['&::part(native)']: {
    ...squareButtonBaseCss,
    ...whiteButtonBase,
    ...buttonTextBaseCss,
    ...(forceStyle ? forceStyle : {}),
  },
}));

export const TabButton = styled(IonButton)({
  ...tabButtonCss,
});

/**
 * Button is just underlined text
 */
export const TextButton = styled.button({
  background: 'none',
});

export const BottomTabButton = styled(IonButton)({
  ...bottomTabButton,
});

export const TopTabButtonActive = styled(IonButton)({
  ...topTabButtonActive,
});

export const TopTabButton = styled(IonButton)({
  ...topTabButton,
});
