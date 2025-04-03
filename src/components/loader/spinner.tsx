import './loader.scss';

import styled from '@emotion/styled';
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
}: {
  header?: string;
  warning?: string;
}) => {
  const [storedTheme] = useTheme();
  const { t } = useTranslation();
  return (
    <LoaderDiv className="fade-in-image">
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
        {warning && (
          <ContentText style={{ color: 'var(--ion-color-danger)' }}>
            {t(warning)}
          </ContentText>
        )}
      </div>
    </LoaderDiv>
  );
};
