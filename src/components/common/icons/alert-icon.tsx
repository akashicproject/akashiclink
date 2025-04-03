import styled from '@emotion/styled';
import { IonIcon } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';

const StyledIcon = styled(IonIcon)`
  width: 48px;
  height: 48px;
  color: var(--ion-color-light);
`;

export const AlertIcon = () => {
  return <StyledIcon icon={alertCircleOutline} />;
};
