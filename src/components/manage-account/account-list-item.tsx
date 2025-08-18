import type { JSX } from '@ionic/core/components';
import { IonIcon, IonLabel } from '@ionic/react';
import { removeCircle } from 'ionicons/icons';

import type { LocalAccount } from '../../utils/hooks/useLocalAccounts';
import { displayLongText } from '../../utils/long-text';
import { AccountIcon } from './account-icon';
import { IconAndLabel } from './account-icon-and-label';
import { AccountOtkTypeTag } from './account-otk-type-tag';

export const AccountListItem = ({
  account,
  showDeleteIcon = false,
  isShortAddress = false,
  isActive = false,
  forceLightMode = false,
  onClick,
  ...props
}: {
  account: LocalAccount;
  showDeleteIcon?: boolean;
  isShortAddress?: boolean;
  isActive?: boolean;
  forceLightMode?: boolean;
  onClick?: () => void;
} & JSX.IonItem) => {
  return (
    <IconAndLabel
      detail={false}
      onClick={onClick}
      key={account.identity}
      forceLightMode={forceLightMode}
      {...props}
    >
      <div
        className={
          'w-100 ion-margin-top ion-margin-bottom ion-align-items-center ion-display-flex ion-gap-sm'
        }
      >
        {showDeleteIcon && (
          <IonIcon
            style={{ fontSize: 32, color: 'var(--ion-color-failed)' }}
            icon={removeCircle}
          />
        )}
        {!account.ledgerId && (
          <AccountIcon
            ledgerId={account.ledgerId}
            isActive={isActive}
            forceLightMode={forceLightMode}
          />
        )}

        <IonLabel>
          <div
            className={
              'ion-display-flex ion-flex-direction-row ion-align-items-center ion-gap-xs'
            }
          >
            <h3 className={'ion-text-align-left ion-margin-bottom-0'}>
              {account.alias ?? account.accountName}{' '}
            </h3>
            <AccountOtkTypeTag account={account} />
          </div>
          <p className={'ion-text-align-left ion-text-size-xxs'}>
            {isShortAddress
              ? displayLongText(account.identity, 16, false, true)
              : account.identity}
          </p>
        </IonLabel>
      </div>
    </IconAndLabel>
  );
};
