import React, { useState } from 'react';
import { IonCheckbox, IonCol, IonGrid, IonRow } from '@ionic/react';
import { PurpleButton, WhiteButton } from '../buttons';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { urls } from '../../constants/urls';
import { useTranslation } from 'react-i18next';

const CreateOrImportForm = () => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

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
        <IonCol size="8" className="ion-center">
          <IonCheckbox
            checked={checked}
            onIonChange={() => {
              setChecked(!checked);
            }}
            className="ion-text-size-sm"
            labelPlacement={'end'}
          >
            {`${t('IAgreeToTermsOfUse')}`}
          </IonCheckbox>
        </IonCol>
        <IonCol size="4" className="ion-center">
          <a
            rel="noreferrer"
            href="https://akashic-1.gitbook.io/akashicwallet/terms-of-use"
            target={'_blank'}
            style={{
              color: '#7444B6',
              textDecoration: 'none',
            }}
            className="ion-text-size-sm"
          >
            {t('TermsOfUse')}
          </a>
        </IonCol>
      </IonRow>
      <IonRow className="ion-grid-gap-xs">
        <IonCol size="12">
          <PurpleButton
            disabled={!checked}
            routerLink={akashicPayPath(urls.createWalletPassword)}
            expand="block"
          >
            {t('CreateYourWallet')}
          </PurpleButton>
        </IonCol>
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
    </IonGrid>
  );
};

export default CreateOrImportForm;
