import './loader.scss';

import styled from '@emotion/styled';
import { IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';

import { themeType } from '../../theme/const';
import { useTheme } from '../PreferenceProvider';
import { ContentText } from '../text/context-text';
import * as darkLoader from './loader-dark.json';
import * as lightLoader from './loader-light.json';

const LoaderDiv = styled.div({
  position: 'absolute',
  background: 'var(--ion-background-color)',
  color: 'black',
  height: '100%',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: 99,
});
export const Spinner = ({
  header,
  warning,
  animationDuration = '5s',
}: {
  header?: string;
  warning?: string;
  animationDuration?: string;
}) => {
  const StyledDiv = styled.div({
    width: '100%',
    display: 'flex',
    position: 'absolute',
    bottom: '20px',
    padding: '24px',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '16px',
    color: 'var(--ion-color-primary-10)',
    gap: '8px',
    alignItems: 'center',
  });
  const StyledIonIcon = styled(IonIcon)`
    font-size: 24px;
  `;
  const [storedTheme] = useTheme();
  const { t } = useTranslation();
  return (
    <LoaderDiv
      className="fade-in-image"
      style={{ animationDuration: animationDuration }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          top: '50%',
          transform: 'translateY(-50%)',
          height: '40vh',
        }}
      >
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData:
              storedTheme === themeType.DARK ? darkLoader : lightLoader,
          }}
        />
        {header && (
          <ContentText className="blink">{t(header) + '...'}</ContentText>
        )}
      </div>
      {warning && (
        <StyledDiv>
          <StyledIonIcon
            src={'/shared-assets/images/alert.svg'}
          ></StyledIonIcon>
          <span>{t(warning)}</span>
        </StyledDiv>
      )}
    </LoaderDiv>
  );
};
