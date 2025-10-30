import {
  IonCol,
  IonGrid,
  IonIcon,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonText,
} from '@ionic/react';
import { caretForwardOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { TextButton } from '../common/buttons';
import {
  DASHBOARD_LIST_SORTING_MODE,
  DashboardPreferenceContext,
} from './dashboard-preference-modal-trigger-button';

export const DashboardPreferenceSorting = () => {
  const { t } = useTranslation();
  const { step, setStep, currenciesSortMode, setCurrenciesSortMode } =
    useContext(DashboardPreferenceContext);

  const handleOnClickCustom = () => {
    setStep(step + 1);
  };

  return (
    <IonGrid
      className={
        'ion-padding-top-0 ion-padding-bottom-xxs ion-padding-left-md ion-padding-right-md'
      }
    >
      <IonRow className={'ion-center ion-grid-row-gap-sm'}>
        <IonCol className={'ion-text-align-center'} size={'12'}>
          <IonText>
            <h2 className="ion-margin-bottom-xxs ion-text-align-left">
              {t('SortBy')}
            </h2>
          </IonText>
          <IonRadioGroup
            value={
              currenciesSortMode ?? DASHBOARD_LIST_SORTING_MODE.Alphabetical
            }
            className="w-100"
          >
            {Object.values(DASHBOARD_LIST_SORTING_MODE).map((mode) => (
              <IonRadio
                mode={'md'}
                key={mode}
                labelPlacement="end"
                justify="start"
                value={mode}
                onClick={(_) => setCurrenciesSortMode(mode)}
                className="w-100 ion-padding-top-xs ion-padding-bottom-xs ion-margin-top-xxs ion-margin-bottom-xxs"
              >
                <h5 className="ion-no-margin">{t(mode)}</h5>
              </IonRadio>
            ))}
          </IonRadioGroup>
        </IonCol>
        <IonCol size={'12'}>
          <div>
            <IonText>
              <h2 className="ion-margin-bottom-xs ion-text-align-left">
                {t('Filter')}
              </h2>
            </IonText>
            <div className="w-100 ion-display-flex ion-align-items-center ion-justify-content-between">
              <IonText className={'ion-text-size-sm ion-text-bold'}>
                {t('Preferences')}
              </IonText>
              <TextButton slot={'end'} onClick={handleOnClickCustom}>
                {t('Custom')} <IonIcon icon={caretForwardOutline} />
              </TextButton>
            </div>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
