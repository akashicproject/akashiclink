import styled from '@emotion/styled';
import { IonRadio } from '@ionic/react';

type RadioProps = {
  width: string;
};
export const SettingsRadio = styled(IonRadio)<RadioProps>`
  height: 24px;
  width: ${(props) => props.width};
  --color-checked: var(--ion-color-primary-70);
  margin-bottom: 8px;
  padding-left: 0;
  ::part(container) {
    height: 16px;
    width: 16px;
    border-color: var(--ion-color-primary-70);
  }
  ::part(label) {
    margin-inline: 8px 0px;
  }
`;
