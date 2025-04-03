import styled from '@emotion/styled';
import { IonIcon, IonRow } from '@ionic/react';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { SecretWords } from '../../components/secret-words/secret-words';
import { urls } from '../../constants/urls';
import { historyGoBack } from '../../routing/history-stack';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { useOwner } from '../../utils/hooks/useOwner';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
} from '../../utils/last-page-storage';
import { restoreOtk, validateSecretPhrase } from '../../utils/otk-generation';
import { scrollWhenPasswordKeyboard } from '../../utils/scroll-when-password-keyboard';
import { View } from '../import-wallet';

const StyledSpan = styled.span({
  fontSize: '12px',
  textAlign: 'center',
  color: 'var(--ion-color-primary-10)',
});
type DivProps = { color: string };
const StyledDiv = styled.div<DivProps>`
  padding: 5px 8px;
  font-size: 9px;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  gap: 4px;
  border: 2px solid #c297ff;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 24px;
  text-align: 'center';
`;
export const SecretPhraseImport = () => {
  const history = useHistory();
  const loginCheck = useOwner(true);

  const [initialWords, setInitialWords] = useState(new Array(12).fill(''));
  const [phrase, setPhrase] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  /** Scrolling on IOS */
  const { isOpen } = useKeyboardState();
  useEffect(() => scrollWhenPasswordKeyboard(isOpen, document), [isOpen]);

  useEffect(() => {
    cacheCurrentPage(
      urls.secretPhraseImport,
      NavigationPriority.IMMEDIATE,
      async () => {
        const { passPhrase } = await lastPageStorage.getVars();
        if (passPhrase) {
          setInitialWords(passPhrase);
        }
      }
    );
  }, []);

  const handleConfirmRecoveryPhrase = async () => {
    try {
      const reconstructedOtk = await restoreOtk(phrase.join(' '));
      await lastPageStorage.clear();
      await lastPageStorage.store(
        urls.importAccountUrl,
        NavigationPriority.IMMEDIATE,
        {
          view: View.SubmitSecretPhrase,
          otk: reconstructedOtk,
          passPhrase: phrase,
        }
      );

      // Remove phrase state before leaving page
      setPhrase([]);
      setInitialWords([]);
      setError(false);
      history.push({
        pathname: akashicPayPath(urls.importAccountUrl),
        state: {
          importView: View.SubmitSecretPhrase,
        },
      });
    } catch (err) {
      setError(true);
    }
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
            initialWords={initialWords}
            disableInput={false}
            onChange={async (value) => {
              if (validateSecretPhrase(value)) {
                setError(false);
              } else {
                setError(true);
              }
              setPhrase(value);
              await lastPageStorage.store(
                urls.secretPhraseImport,
                NavigationPriority.IMMEDIATE,
                {
                  passPhrase: value,
                }
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
            hidden={!error}
            color="#DE3730"
            style={{ justifyContent: 'center', border: '1px solid #DE3730' }}
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
              disabled={error}
              onClick={handleConfirmRecoveryPhrase}
            >
              {t('Confirm')}
            </PurpleButton>
            <WhiteButton
              style={{ width: '100%' }}
              onClick={async () => {
                setPhrase([]);
                setInitialWords([]);
                setError(false);
                await lastPageStorage.clear();
                historyGoBack(
                  history,
                  !loginCheck.isLoading && !loginCheck.authenticated
                );
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
