import { IonIcon } from '@ionic/react';
import React, { useState } from 'react';

import { REFRESH_BUTTON_DISABLED_TIME } from '../../constants';
import { themeType } from '../../theme/const';
import { useBalancesMe } from '../../utils/hooks/useBalancesMe';
import { useNftMe } from '../../utils/hooks/useNftMe';
import { useNftTransfersMe } from '../../utils/hooks/useNftTransfersMe';
import { useTransfersMe } from '../../utils/hooks/useTransfersMe';
import { SquareWhiteButton } from '../common/buttons';
import { useTheme } from '../providers/PreferenceProvider';

export const RefreshDataButton = () => {
  const { mutateTransfersMe } = useTransfersMe();
  const { mutateNftTransfersMe } = useNftTransfersMe();
  const { mutateBalancesMe } = useBalancesMe();
  const { mutateNftMe } = useNftMe();

  const [storedTheme] = useTheme();
  const [refreshDisabled, setRefreshDisabled] = useState(false);

  return (
    <SquareWhiteButton
      disabled={refreshDisabled}
      className="icon-button"
      id="refresh-button"
      onClick={async () => {
        try {
          setRefreshDisabled(true);
          await mutateTransfersMe();
          await mutateNftTransfersMe();
          await mutateBalancesMe();
          await mutateNftMe();
        } finally {
          // To prevent spam of the backend, disable the refresh button for a little while
          setTimeout(
            () => setRefreshDisabled(false),
            REFRESH_BUTTON_DISABLED_TIME
          );
        }
      }}
    >
      <IonIcon
        slot="icon-only"
        className="icon-button-icons"
        src={`/shared-assets/images/${
          storedTheme === themeType.DARK
            ? 'refresh-dark.svg'
            : 'refresh-light.svg'
        }`}
      />
    </SquareWhiteButton>
  );
};
