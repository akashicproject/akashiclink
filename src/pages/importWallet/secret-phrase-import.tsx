import styled from '@emotion/styled';
import { IonIcon, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { SecretWords } from '../../components/secret-words/secret-words';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
} from '../../utils/last-page-storage';
import { restoreOtk } from '../../utils/otk-generation';
import { View } from '../import-wallet';

const StyledSpan = styled.span({
  fontSize: '12px',
  textAlign: 'center',
});
type DivProps = { color: string };
const StyledDiv = styled.div<DivProps>`
  padding: 5px 8px;
  font-size: 9px;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  gap: 4px;
  border: 2px solid var(--ion-color-light);
  border-radius: 8px;
  width: 100%;
  margin-bottom: 24px;
`;
export const SecretPhraseImport = () => {
  const history = useHistory();
  const [initialWords, setInitialWords] = useState(new Array(12).fill(''));
  const [phrase, setPhrase] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
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
      const privateKey = await restoreOtk(phrase.join(' '));
      await lastPageStorage.store(
        urls.importAccountUrl,
        NavigationPriority.IMMEDIATE,
        {
          view: View.SubmitSecretPhrase,
          initialView: View.SubmitSecretPhrase,
          privateKey: privateKey.key.prv.pkcs8pem,
          passPhrase: phrase,
        }
      );
      history.push({
        pathname: akashicPayPath(urls.importAccountUrl),
        state: {
          view: View.SubmitSecretPhrase,
        },
      });
    } catch (err) {
      setError(true);
    }
  };

  return (
    <PublicLayout contentStyle={{ padding: '0 10px' }}>
      <MainGrid style={{ gap: '15px', padding: '0px 15px' }}>
        <IonRow>
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
              style={{ textDecoration: 'none' }}
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
              disabled={phrase.includes('')}
              onClick={handleConfirmRecoveryPhrase}
            >
              {t('Confirm')}
            </PurpleButton>
            <WhiteButton
              style={{ width: '100%' }}
              onClick={() => {
                history.push(akashicPayPath(urls.selectImportMethod));
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
