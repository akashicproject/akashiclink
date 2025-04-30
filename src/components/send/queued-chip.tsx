import styled from '@emotion/styled';
import { IonChip, IonSpinner, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';

const StyledIonChip = styled(IonChip)({
  border: '1px solid var(--ion-color-grey)',
  backgroundColor: 'transparent',
  minHeight: '24px',
});

export const QueuedChip = () => {
  const { t } = useTranslation();

  return (
    <StyledIonChip
      color="primary"
      className={
        'ion-padding-xxs ion-padding-left-sm ion-padding-right-sm ion-display-flex ion-align-items-center ion-gap-xs ion-margin-0'
      }
    >
      <IonText
        color={'warning'}
        className={'ion-text-size-xs ion-text-color-grey'}
      >
        {t('Queued')}
      </IonText>
      <IonSpinner
        name={'circular'}
        style={{
          width: '12px',
          height: '12px',
          color: 'var(--ion-color-secondary-container)',
        }}
      />
    </StyledIonChip>
  );
};
