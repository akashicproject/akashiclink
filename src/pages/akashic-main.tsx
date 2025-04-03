import './akashic-main.scss';

import styled from '@emotion/styled';
import { IonCheckbox, IonCol, IonImg, IonRow, isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PurpleButton, WhiteButton } from '../components/buttons';
import { PublicLayout } from '../components/layout/public-layout';
import { LoginForm } from '../components/public/login-form';
import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tree';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { useOwner } from '../utils/hooks/useOwner';
import {
  lastPageStorage,
  NavigationPriority,
} from '../utils/last-page-storage';

/**
 * First page seen by user when navigating to app
 * or opening extension.
 * - Logic to automatically restore previous session view
 * - Logic to present user when import or login menues depending
 *   on whether this is first login with this device
 */
export function AkashicPayMain() {
  const { t } = useTranslation();
  const isMobile = isPlatform('mobile');
  const { localAccounts } = useAccountStorage();
  const history = useHistory();
  const loginCheck = useOwner(true);
  const [checked, setChecked] = useState(false);
  /**
   * Check if there is a forced page to redirect to
   * Sometimes a random loggedFunction with immediate priority sneaks in there (at least when moving between app versions)
   *  which causes unwanted push here, so we check for that.
   * TODO: Figure out root cause and address
   */
  const StyledSpan = styled.span({
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'Nunito Sans',
    color: 'var(--ion-color-primary-10)',
  });
  useEffect(() => {
    const loadPage = async () => {
      const lastPage = await lastPageStorage.get();
      if (
        lastPage &&
        lastPage.lastPageUrl !== urls.loggedFunction &&
        lastPage.navigationPriority === NavigationPriority.IMMEDIATE
      )
        history.push(akashicPayPath(lastPage.lastPageUrl));
    };
    loadPage();
  }, []);

  /**
   * For all other redirects, await until user has passed authentication
   */
  useEffect(
    () => {
      if (!loginCheck.isLoading && loginCheck.authenticated)
        lastPageStorage.get().then((lastPage) => {
          lastPage
            ? history.push(akashicPayPath(lastPage.lastPageUrl))
            : history.push(akashicPayPath(urls.loggedFunction));
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginCheck.isLoading]
  );

  return (
    <PublicLayout>
      <IonRow>
        <IonCol class="ion-center">
          <IonImg
            className={
              isMobile || !localAccounts.length
                ? 'welcome-img'
                : 'welcome-img-small'
            }
            alt=""
            style={{
              height: '130px',
              width: '104px',
            }}
          />
        </IonCol>
      </IonRow>
      {
        // Login form only displayed if local account has been imported
        localAccounts.length ? (
          <LoginForm />
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <h3 style={{ marginTop: '24px', margin: '0' }}>
              {t('EmpoweringYourWealth')}
            </h3>
            <IonRow
              style={{
                marginTop: '24px',
              }}
            >
              <IonCol
                size="12"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IonCheckbox
                  style={{ marginRight: '8px' }}
                  onIonChange={() => {
                    setChecked(!checked);
                  }}
                />
                <StyledSpan>
                  {t('IAgreeToTermsOfUse')}{' '}
                  <a
                    rel="noreferrer"
                    href="https://akashic-1.gitbook.io/akashicwallet/terms-of-use"
                    target={'_blank'}
                    style={{
                      color: '#7444B6',
                      textDecoration: 'none',
                      fontSize: '12px',
                    }}
                  >
                    {t('TermsOfUse')}
                  </a>
                </StyledSpan>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <PurpleButton
                  disabled={!checked}
                  routerLink={akashicPayPath(urls.createWalletUrl)}
                  expand="block"
                >
                  {t('CreateYourWallet')}
                </PurpleButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <WhiteButton
                  disabled={!checked}
                  routerLink={akashicPayPath(urls.selectImportMethod)}
                  expand="block"
                >
                  {t('ImportWallet')}
                </WhiteButton>
              </IonCol>
            </IonRow>
          </div>
        )
      }
    </PublicLayout>
  );
}
