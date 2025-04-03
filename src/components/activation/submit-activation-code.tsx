import styled from '@emotion/styled';
import { activationCodeRegex } from '@helium-pay/backend';
import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../buttons';
import { MainGrid } from '../layout/main-grid';
import { StyledInput, StyledInputErrorPrompt } from '../styled-input';

const Message = styled.span({
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  fontFamily: 'Nunito Sans',
  textAlign: 'center',
  color: 'var(--ion-color)',
});

/**
 * Component instructing user to supply a 2fa code, which is injected into the callback function
 * and sent as a request when CONFIRM is clicked
 */
export function SubmitActivationCode({
  onClose,
  submitWithActivationCode,
}: {
  onClose: () => void;
  submitWithActivationCode: (activationCode: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [activationCode, setActivationCode] = useState<string>();

  const validateActivationCode = (value: string) =>
    !!value.match(activationCodeRegex);

  return (
    <MainGrid>
      <IonRow>
        <IonCol class="ion-center">
          <Message>{t('Complete2FA')}</Message>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <StyledInput
            label={t('ActivationCode')}
            placeholder={t('PleaseEnterCode')}
            onIonInput={({ target: { value } }) =>
              setActivationCode(value as string)
            }
            errorPrompt={StyledInputErrorPrompt.ActivationCode}
            validate={validateActivationCode}
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <WhiteButton
            onClick={() => {
              setActivationCode(undefined);
              onClose();
            }}
          >
            {t('Cancel')}
          </WhiteButton>
        </IonCol>
        <IonCol class="ion-center">
          <PurpleButton
            disabled={!activationCode}
            onClick={async () => {
              activationCode && submitWithActivationCode(activationCode);
            }}
          >
            {t('Confirm')}
          </PurpleButton>
        </IonCol>
      </IonRow>
    </MainGrid>
  );
}
