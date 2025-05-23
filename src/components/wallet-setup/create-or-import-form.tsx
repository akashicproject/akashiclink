import { IonCheckbox, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { LINK_TYPE, useI18nInfoUrls } from '../../i18n/links';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { PrimaryButton, WhiteButton } from '../common/buttons';

export const CreateOrImportForm = () => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const infoUrls = useI18nInfoUrls();

  return (
    <IonGrid>
      <IonRow className="ion-grid-gap-xs">
        <IonCol size="12">
          <h3 className="ion-justify-content-center ion-margin-bottom">
            {t('EmpoweringYourWealth')}
          </h3>
        </IonCol>
      </IonRow>
      <IonRow style={{ marginBottom: '0.75rem' }}>
        <IonCol className="ion-center">
          <IonCheckbox
            checked={checked}
            onIonChange={() => {
              setChecked(!checked);
            }}
            className="ion-text-size-xs ion-margin-right-xxs"
            labelPlacement={'end'}
          >
            {`${t('IAgreeToTermsOfUse')}`}
          </IonCheckbox>
          <a
            rel="noreferrer"
            href={infoUrls[LINK_TYPE.TermsOfUse]}
            target={'_blank'}
            style={{
              color: 'var(--ion-color-primary)',
              textDecoration: 'none',
            }}
            className="ion-text-size-xs"
          >
            {t('TermsOfUse')}
          </a>
        </IonCol>
      </IonRow>
      <IonRow className="ion-grid-gap-xs">
        <IonCol size="12">
          <PrimaryButton
            disabled={!checked}
            routerLink={akashicPayPath(urls.createWalletPassword)}
            expand="block"
          >
            {t('CreateYourWallet')}
          </PrimaryButton>
        </IonCol>
        <IonCol>
          <WhiteButton
            disabled={!checked}
            routerLink={akashicPayPath(urls.importWalletSelectMethod)}
            expand="block"
          >
            {t('ImportWallet')}
          </WhiteButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
