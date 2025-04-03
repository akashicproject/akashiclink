import type { CSSInterpolation } from '@emotion/serialize/types';
import styled from '@emotion/styled';
import { IonButton } from '@ionic/react';

const purple = '#7444B6';
const white = '#FFFFFF';

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
  fontFamily: 'Nunito Sans',
  textTransform: 'none',
};

const purpleButtonCss: CSSInterpolation = {
  ['&::part(native)']: {
    ...buttonBaseCss,
    background: purple,
    color: white,
    ...buttonTextBaseCss,
  },
};

const whiteButtonCss: CSSInterpolation = {
  ['&::part(native)']: {
    ...buttonBaseCss,
    background: 'var(--ion-white-button-background)',
    borderColor: '#7B757F',
    color: 'var(--ion-white-button-text)',
    ...buttonTextBaseCss,
    [':active, :focus']: {
      background: 'rgba(103, 80, 164, 0.08)',
    },
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
    [':active, :focus']: {
      borderBottom: '2px solid #C297FF',
    },
  },
};

export const PurpleButton = styled(IonButton)({
  ...purpleButtonCss,
});

export const WhiteButton = styled(IonButton)({
  ...whiteButtonCss,
});

export const TabButton = styled(IonButton)({
  ...tabButtonCss,
});
