import './loader.scss';

import styled from '@emotion/styled';
import { IonIcon } from '@ionic/react';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';

import { ContentText } from '../text/context-text';
import akashicLoadingAnimation from './akashic_loading_animation.json';

const LoaderDiv = styled.div({
  position: 'absolute',
  background: 'var(--ion-background-color)',
  color: 'black',
  height: '100%',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: 99,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

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
  justifyContent: 'center',
});

export const Spinner = ({
  header,
  warning,
  animationDuration = 'auto',
}: {
  header?: string;
  warning?: string;
  animationDuration?: string;
}) => {
  const { t } = useTranslation();

  return (
    <LoaderDiv className="fade-in-image" style={{ animationDuration }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: 220,
          margin: 'auto',
        }}
      >
        <Lottie animationData={akashicLoadingAnimation} loop autoplay />
        {header && (
          <ContentText className="blink">{t(header) + '...'}</ContentText>
        )}
      </div>
      {warning && (
        <StyledDiv>
          <IonIcon
            className={'ion-text-size-xxl'}
            src={'/shared-assets/images/alert.svg'}
          />
          <span>{t(warning)}</span>
        </StyledDiv>
      )}
    </LoaderDiv>
  );
};
