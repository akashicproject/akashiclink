import { IonIcon, IonItem, IonText } from '@ionic/react';
import { addOutline, arrowDownOutline } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { List } from '../common/list/list';

export const AccountManagementList = ({
  isDeleting,
  onClickRemove,
}: {
  isDeleting: boolean;
  onClickRemove: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <List>
      <IonItem detail={false} button onClick={onClickRemove}>
        <IonIcon
          style={{ fontSize: 18 }}
          color={'primary'}
          icon={'/shared-assets/icons/trash.svg'}
        />
        <IonText
          color={'primary'}
          className={
            'ion-padding-top-xs ion-padding-bottom-xs ion-text-align-left ion-text-size-sm'
          }
        >
          {t(isDeleting ? 'Cancel' : 'RemoveAccount')}
        </IonText>
      </IonItem>
      <IonItem
        detail={false}
        button
        routerLink={akashicPayPath(urls.importWalletSelectMethod)}
        routerOptions={{ unmount: true }}
      >
        <IonIcon
          style={{ fontSize: 18 }}
          color={'primary'}
          icon={arrowDownOutline}
        />
        <IonText
          color={'primary'}
          className={
            'ion-padding-top-xs ion-padding-bottom-xs ion-text-align-left ion-text-size-sm'
          }
        >
          {t('ImportWallet')}
        </IonText>
      </IonItem>
      <IonItem
        lines={'none'}
        detail={false}
        button
        routerLink={akashicPayPath(urls.createWalletPassword)}
        routerOptions={{ unmount: true }}
      >
        <IonIcon style={{ fontSize: 18 }} color={'primary'} icon={addOutline} />
        <IonText
          color={'primary'}
          className={
            'ion-padding-top-xs ion-padding-bottom-xs ion-text-align-left ion-text-size-sm'
          }
        >
          {t('CreateWallet')}
        </IonText>
      </IonItem>
    </List>
  );
};
