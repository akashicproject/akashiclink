import styled from '@emotion/styled';
import { IonIcon, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { SecretWords } from '../../components/secret-words/secret-words';
import { historyGoBack } from '../../routing/history-stack';
import {
  onInputChange,
  reconstructOtkAsync,
  selectError,
  selectImportWalletForm,
} from '../../slices/importWalletSlice';
import { validateSecretPhrase } from '../../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';

const StyledSpan = styled.span({
  fontSize: '12px',
  textAlign: 'center',
  color: 'var(--ion-color-primary-10)',
});
type DivProps = { color: string };
const StyledDiv = styled.div<DivProps>`
  padding: 4px 8px;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  gap: 4px;
  border: 2px solid #c297ff;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 24px;
  text-align: center;
`;
export const SecretPhraseImport = () => {
  const history = useHistory();
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const importWalletForm = useAppSelector(selectImportWalletForm);
  const dispatch = useAppDispatch();
  const importWalletError = useAppSelector(selectError);
  const [isDisabled, setIsDisabled] = useState(true);

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  useEffect(() => {
    if (importWalletError) {
      setError(true);
    } else {
      setError(false);
    }
  }, [importWalletError]);

  const handleConfirmRecoveryPhrase = async () => {
    dispatch(reconstructOtkAsync(importWalletForm.passPhrase!));
    dispatch(
      onInputChange({
        passPhrase: new Array(12).fill(''),
      })
    );
    setIsDisabled(true);
  };

  return (
    <PublicLayout contentStyle={{ padding: '0 10px' }}>
      <MainGrid style={{ gap: '15px', padding: '0px 15px' }}>
        <IonRow style={{ justifyContent: 'center' }}>
          <h2
            style={{
              fontSize: '20px',
            }}
          >
            {t('AccessWalletWithRecoveryPhrase')}
          </h2>
          <StyledSpan>
            {t('AkashicWalletCannotRecoverYourPassword')}{' '}
            <a
              href="https://akashic-1.gitbook.io/akashicwallet/"
              target={'_blank'}
              style={{ textDecoration: 'none', color: '#7444B6' }}
              rel="noreferrer"
            >
              {t('LearnMore')}
            </a>
          </StyledSpan>
        </IonRow>
        <IonRow style={{ justifyContent: 'center' }}>
          <StyledSpan style={{ fontWeight: '700' }}>
            {t('TypeSecretPhrase')}
          </StyledSpan>
        </IonRow>
        <IonRow>
          <SecretWords
            inputVisibility={true}
            initialWords={importWalletForm.passPhrase!}
            disableInput={false}
            onChange={async (value) => {
              if (validateSecretPhrase(value)) {
                setError(false);
                setIsDisabled(false);
              } else {
                setError(true);
                setIsDisabled(true);
              }
              dispatch(
                onInputChange({
                  passPhrase: value,
                })
              );
            }}
          ></SecretWords>
        </IonRow>
        <IonRow style={{ justifyContent: 'center', marginBottom: '0px' }}>
          <StyledDiv color="var(--ion-color-primary-10)">
            <IonIcon
              src="shared-assets/images/alert.svg"
              style={{ fontSize: '13px' }}
            />
            {t('PasteYourSecretPhrase')}
          </StyledDiv>
          <StyledDiv
            color="#DE3730"
            style={{
              justifyContent: 'center',
              border: '1px solid #DE3730',
              display: !error ? 'none' : 'flex',
            }}
          >
            {t('InvalidInput')}
          </StyledDiv>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <PurpleButton
              style={{ width: '100%' }}
              disabled={isDisabled}
              onClick={handleConfirmRecoveryPhrase}
            >
              {t('Confirm')}
            </PurpleButton>
            <WhiteButton
              style={{ width: '100%' }}
              onClick={async () => {
                dispatch(
                  onInputChange({
                    passPhrase: new Array(12).fill(''),
                  })
                );
                setError(false);
                historyGoBack(history, true);
              }}
            >
              {t('Cancel')}
            </WhiteButton>
          </div>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
