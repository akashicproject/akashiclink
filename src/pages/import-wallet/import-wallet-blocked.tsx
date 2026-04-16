import { IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../components/common/buttons';
import { ErrorIconWithTitle } from '../../components/common/state-icon-with-title/error-icon-with-title';
import { ContactSupportText } from '../../components/common/text/contact-support-text';
import { MainGrid } from '../../components/layout/main-grid';
import { AccountListItem } from '../../components/manage-account/account-list-item';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { urls } from '../../constants/urls';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  onClear,
  selectOtk,
  selectOtkType,
} from '../../redux/slices/importWalletSlice';
import { historyResetStackAndRedirect } from '../../routing/history';

export const ImportWalletBlocked = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const otk = useAppSelector(selectOtk);
  const otkType = useAppSelector(selectOtkType);

  const handleOnConfirm = async () => {
    dispatch(onClear());
    historyResetStackAndRedirect(urls.akashicPay);
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow className={'ion-grid-row-gap-md ion-center'}>
          <IonCol size={'12'} className={'ion-center'}>
            <ErrorIconWithTitle title={t('PleaseSignInOtherAccountFirst')} />
          </IonCol>
          {otkType && otk && (
            <IonCol size={'12'}>
              <AccountListItem
                lines={'none'}
                account={{
                  identity: otk.identity,
                  accountName: `Account ${otk.identity.slice(-8)}`,
                  otkType: otkType,
                }}
              />
            </IonCol>
          )}
          <IonCol size={'6'}>
            <PrimaryButton expand="block" onClick={handleOnConfirm}>
              {t('Confirm')}
            </PrimaryButton>
          </IonCol>
        </IonRow>
        <ContactSupportText />
      </MainGrid>
    </PublicLayout>
  );
};
