import type { JSX } from '@ionic/core/components';
import { IonLabel } from '@ionic/react';
import type { MouseEvent } from 'react';

import { type DepositChainOption } from '../../../utils/hooks/useAccountL1Address';
import { displayLongText } from '../../../utils/long-text';
import { IconButton } from '../../common/buttons';
import { L2Icon } from '../../common/chain-icon/l2-icon';
import { NetworkIcon } from '../../common/chain-icon/network-icon';
import { CopyButton } from '../../common/copy-button';
import { IconAndLabel } from '../../manage-account/account-icon-and-label';

export const AddressQuickAccessDropdownItem = ({
  displayName,
  chain,
  address,
  triggerId,
  isTrigger,
  style,
  onClickIcon,
  onClickLabel,
  ...props
}: {
  displayName: string;
  triggerId?: string;
  isTrigger?: boolean;
  chain: DepositChainOption;
  address: string;
  onClickIcon?: (e: MouseEvent<Element>) => void;
  onClickLabel?: (e: MouseEvent<Element>) => void;
  id?: string;
  style?: React.CSSProperties;
} & JSX.IonItem) => {
  return (
    <IconAndLabel
      style={style}
      lines={'none'}
      detail={false}
      className="ion-padding-left-xs"
      isTrigger={isTrigger}
      {...props}
    >
      <div
        className={
          'w-100 ion-align-items-center ion-display-flex cursor-pointer'
        }
      >
        <IconButton size={40} onClick={onClickIcon}>
          {chain === 'AkashicChain' ? (
            <L2Icon size={32} />
          ) : (
            <NetworkIcon chain={chain} size={32} />
          )}
        </IconButton>
        <IonLabel
          id={triggerId}
          onClick={(e) => {
            isTrigger && onClickLabel && onClickLabel(e);
          }}
        >
          <h3 className={'ion-text-align-left ion-margin-bottom-0'}>
            {displayName}
          </h3>
          <div
            className={'ion-display-flex ion-gap-xxxs ion-align-items-center'}
          >
            <p
              className={
                'ion-text-align-left ion-text-size-xs ion-text-color-grey ion-margin-0'
              }
            >
              {displayLongText(address, 16, false, true)}
            </p>
            <CopyButton value={address} size={14} side={'right'} />
          </div>
        </IonLabel>
      </div>
    </IconAndLabel>
  );
};
