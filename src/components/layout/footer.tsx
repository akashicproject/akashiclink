import styled from '@emotion/styled';
import { IonFooter } from '@ionic/react';

import { useLocalStorage } from '../../utils/hooks/useLocalStorage';

const StyledIonFooter = styled(IonFooter)({
  margin: 'auto',
  paddingBottom: 'var(--ion-safe-area-bottom, 0)',
});

const VersionTag = styled.div({
  textAlign: 'center',
  fontFamily: 'Nunito Sans',
  fontSize: '8px',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: '16px',
  letterSpacing: '0.5px',
  borderRadius: '8px 8px 0px 0px',
  padding: '8px',
  color: 'var(--ion-text-color)',
  width: 80,
  margin: 'auto',
});
export function Footer() {
  const [currentAppVersion] = useLocalStorage('current-app-version', '0.0.0');
  return (
    <StyledIonFooter className="ion-no-border">
      <VersionTag>{`(Version ${currentAppVersion})`}</VersionTag>
    </StyledIonFooter>
  );
}
