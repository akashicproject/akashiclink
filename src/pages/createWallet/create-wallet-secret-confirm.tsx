import styled from '@emotion/styled';
import { IonCol, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/layout/public-layout';
import { SecretWords } from '../../components/secret-words/secret-words';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import {
  cacheCurrentPage,
  lastPageStorage,
  NavigationPriority,
} from '../../utils/last-page-storage';
import { getRandomNumbers } from '../../utils/random-utils';
export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '400',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});

export function CreateWalletSecretConfirm() {
  const { t } = useTranslation();
  const history = useHistory<LocalAccount>();
  const [passPhrase, setPassPhrase] = useState<string>('');
  const [secretWords, setSecretWords] = useState<Array<string>>([]);
  const [inputValue, setInputValue] = useState<Array<string>>([]);

  useEffect(() => {
    cacheCurrentPage(
      urls.secretConfirm,
      NavigationPriority.IMMEDIATE,
      async () => {
        const data = await lastPageStorage.getVars();
        if (data.passPhrase && !data.passPhraseWithEmptyWords) {
          setPassPhrase(data.passPhrase);
          const randomNumberArray = getRandomNumbers(0, 11, 4);
          const sWords = data.passPhrase.split(' ');
          randomNumberArray.forEach((e) => {
            sWords[e] = '';
          });
          setSecretWords(sWords);
          lastPageStorage.store(urls.secret, NavigationPriority.IMMEDIATE, {
            passPhrase: data.passPhrase,
            passPhraseWithEmptyWords: sWords,
          });
        } else if (data.passPhraseWithEmptyWords) {
          setPassPhrase(data.passPhrase);
          setSecretWords(data.passPhraseWithEmptyWords);
        }
      }
    );
  }, []);

  return (
    <PublicLayout contentStyle={{ padding: '0 30px' }}>
      <MainGrid style={{ gap: '24px', padding: '0' }}>
        <IonRow>
          <IonCol size="12" style={{ textAlign: 'center' }}>
            <IonRow>
              <h2
                style={{
                  margin: '0 56px',
                }}
              >
                {t('ConfirmSecretRecovery')}
              </h2>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonRow style={{ textAlign: 'left' }}>
              <h3 style={{ margin: '0' }}>{t('Important')}</h3>
              <StyledSpan style={{ textAlign: 'justify' }}>
                {t('SaveBackUpSecureLocation')}
              </StyledSpan>
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
              {secretWords.length && (
                <SecretWords
                  initialWords={secretWords}
                  withAction={false}
                  onChange={(value) => {
                    setInputValue(value);
                  }}
                />
              )}
            </IonRow>
            <IonRow style={{ justifyContent: 'space-around' }}>
              <IonCol size="5">
                <PurpleButton
                  style={{ width: '100%' }}
                  expand="block"
                  onClick={async () => {
                    if (inputValue.join(' ') === passPhrase) {
                      await lastPageStorage.clear();
                      history.push({
                        pathname: akashicPayPath(urls.walletCreated),
                        state: history.location.state,
                      });
                    }
                  }}
                >
                  {t('Confirm')}
                </PurpleButton>
              </IonCol>
              <IonCol size="5">
                <WhiteButton
                  style={{ width: '100%' }}
                  fill="clear"
                  onClick={async () => {
                    await lastPageStorage.store(
                      urls.secret,
                      NavigationPriority.IMMEDIATE,
                      {
                        passPhrase: passPhrase,
                        passPhraseWithEmptyWords: secretWords,
                      }
                    );
                    history.push({
                      pathname: akashicPayPath(urls.secret),
                      state: history.location.state,
                    });
                  }}
                >
                  {t('GoBack')}
                </WhiteButton>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
}
