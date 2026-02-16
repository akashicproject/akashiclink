import { IonCol, IonRow } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BorderedBox } from '../components/common/box/border-box';
import { OutlineButton, PrimaryButton } from '../components/common/buttons';
import { AccountListItem } from '../components/manage-account/account-list-item';
import { PopupLayout } from '../components/page-layout/popup-layout';
import { useAppSelector } from '../redux/app/hooks';
import { selectTheme } from '../redux/slices/preferenceSlice';
import { BRIDGE_MESSAGE } from '../types/bridge-types';
import { responseErrorToSite, responseToSite } from '../utils/chrome';
import { useAccountStorage } from '../utils/hooks/useLocalAccounts';
import { useSetGlobalLanguage } from '../utils/hooks/useSetGlobalLanguage';
import { useSignMessage } from '../utils/hooks/useSignMessage';
import { ConnectionBackButton } from './connection-back-button';

export function WalletConnection() {
  const { t } = useTranslation();
  const [id, setId] = useState<number>();

  useEffect(() => {
    const url = new URL(window.location.href);
    const idParam = url.searchParams.get('id');
    if (idParam) setId(Number(idParam));
  }, []);

  // retrieve user AL setting
  const storedTheme = useAppSelector(selectTheme);
  const [globalLanguage] = useSetGlobalLanguage();

  const { activeAccount } = useAccountStorage();

  const signMessage = useSignMessage();

  const [isProcessing, setIsProcessing] = useState(false);

  const onClickApproveConnect = async () => {
    try {
      setIsProcessing(true);
      const payloadToSign = {
        identity: activeAccount?.identity ?? '',
        expires: Date.now() + 60 * 1000,
      };

      const walletPreference = {
        theme: storedTheme,
        language: globalLanguage.replace('-', '='), // use replace for backward compatible with "-"
      };

      const signedMsg = signMessage(payloadToSign);
      await responseToSite(BRIDGE_MESSAGE.APPROVAL_DECISION, id, true, {
        payload: payloadToSign,
        signature: signedMsg,
        walletPreference,
      });
    } catch (e) {
      await responseErrorToSite(
        e instanceof Error ? e.message : JSON.stringify(e),
        id
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const onClickRejectConnect = async () => {
    setIsProcessing(true);
    await responseToSite(BRIDGE_MESSAGE.APPROVAL_DECISION, id, false);
    setIsProcessing(false);
  };

  return (
    <PopupLayout showIdentity={false}>
      <IonRow>
        <IonCol size={'12'}>
          <ConnectionBackButton />
        </IonCol>
        <IonCol size={'12'}>
          <h2 className="ion-justify-content-center ion-margin-top-lg ion-margin-bottom-xs">
            {t('Permissions')}
          </h2>
          <p className="ion-justify-content-center ion-margin-bottom-sm ion-text-align-center">
            {t('AllowSite')}
          </p>
        </IonCol>
        <IonCol size={'12'}>
          <BorderedBox lines="full" className={'ion-margin-top-sm'}>
            <div className={'ion-padding-vertical'}>
              <p className="ion-justify-content-center ion-margin-bottom-md">
                {t('SeeAddressAccountBalance')}
              </p>
              <p className="ion-justify-content-center ion-margin-bottom-xxs">
                {t('RequestNowFor')}
              </p>
              {activeAccount && (
                <AccountListItem lines={'none'} account={activeAccount} />
              )}
            </div>
          </BorderedBox>
        </IonCol>
      </IonRow>
      <IonRow className={'ion-margin-top-auto'}>
        <IonCol size={'12'}>
          <IonRow>
            <IonCol size={'6'}>
              <OutlineButton
                expand="block"
                onClick={onClickRejectConnect}
                disabled={isProcessing}
              >
                {t('Deny')}
              </OutlineButton>
            </IonCol>
            <IonCol size={'6'}>
              <PrimaryButton
                expand="block"
                onClick={onClickApproveConnect}
                isLoading={isProcessing}
              >
                {t('Confirm')}
              </PrimaryButton>
            </IonCol>
          </IonRow>
        </IonCol>
      </IonRow>
    </PopupLayout>
  );
}
