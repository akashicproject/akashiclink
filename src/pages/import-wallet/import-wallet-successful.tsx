import { IonCol, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../components/common/buttons';
import { SuccessfulIconWithTitle } from '../../components/common/state-icon-with-title/successful-icon-with-title';
import { ContactSupportText } from '../../components/common/text/contact-support-text';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { useAppDispatch } from '../../redux/app/hooks';
import { onClear } from '../../redux/slices/importWalletSlice';
import { historyResetStackAndRedirect } from '../../routing/history';
import { useFetchAndRemapAASToAddress } from '../../utils/hooks/useFetchAndRemapAASToAddress';
import { useFetchAndRemapL1Address } from '../../utils/hooks/useFetchAndRemapL1address';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';

export const ImportWalletSuccessful = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const fetchAndRemapAASToAddress = useFetchAndRemapAASToAddress();
  const fetchAndRemapL1Address = useFetchAndRemapL1Address();
  const { activeAccount } = useAccountStorage();

  const handleOnConfirm = async () => {
    dispatch(onClear());
    if (activeAccount?.identity) {
      await fetchAndRemapAASToAddress({
        identity: activeAccount.identity,
        otkType: activeAccount.otkType,
      });
      await fetchAndRemapL1Address();
    }
    // migration flow is finished, completely reset router history
    historyResetStackAndRedirect();
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow className={'ion-grid-row-gap-md ion-center'}>
          <IonCol size={'12'} className={'ion-center'}>
            <SuccessfulIconWithTitle title={t('ImportSuccessful')} />
          </IonCol>
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
