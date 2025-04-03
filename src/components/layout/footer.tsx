import styled from '@emotion/styled';

import { useLocalStorage } from '../../utils/hooks/useLocalStorage';

const StyledFooter = styled.div({
  backgroundColor: '#7444B6',
  textAlign: 'center',
  fontFamily: 'Nunito Sans',
  fontSize: '8px',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: '16px',
  letterSpacing: '0.5px',
  borderRadius: '8px 8px 0px 0px',
  padding: '2px 8px',
  color: '#FFF',
});
export function Footer() {
  const [currentAppVersion] = useLocalStorage('current-app-version', '0.0.0');
  return <StyledFooter>{`(Version ${currentAppVersion})`}</StyledFooter>;
}
