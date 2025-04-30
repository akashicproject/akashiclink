import { useState } from 'react';

import { REFRESH_BUTTON_DISABLED_TIME } from '../../../constants';
import { useAccountMe } from '../../../utils/hooks/useAccountMe';
import { useMyTransfersInfinite } from '../../../utils/hooks/useMyTransfersInfinite';
import { useNftMe } from '../../../utils/hooks/useNftMe';
import { useNftTransfersMe } from '../../../utils/hooks/useNftTransfersMe';
import { IconButton } from '../../common/buttons';

export const RefreshDataButton = () => {
  const { mutateMyTransfers } = useMyTransfersInfinite();
  const { mutateNftTransfersMe } = useNftTransfersMe();
  const { mutate: mutateAccountMe } = useAccountMe();
  const { mutateNftMe } = useNftMe();

  const [refreshDisabled, setRefreshDisabled] = useState(false);

  return (
    <IconButton
      size={32}
      src={`/shared-assets/images/refresh.svg`}
      disabled={refreshDisabled}
      onClick={async () => {
        try {
          setRefreshDisabled(true);
          await mutateMyTransfers();
          await mutateNftTransfersMe();
          await mutateAccountMe();
          await mutateNftMe();
        } finally {
          // To prevent spam of the backend, disable the refresh button for a little while
          setTimeout(
            () => setRefreshDisabled(false),
            REFRESH_BUTTON_DISABLED_TIME
          );
        }
      }}
    />
  );
};
