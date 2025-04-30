import styled from '@emotion/styled';
import { IonImg } from '@ionic/react';
import { useEffect, useState } from 'react';

import { getNftImage } from '../../utils/nft-image-link';

const StyledNftImage = styled(IonImg)({
  height: '32px',
  width: '32px',
  minWidth: '32px',
  borderRadius: '32px',
  overflow: 'hidden',
});
export const StyledInitialIcon = styled.div<{
  isActive: boolean;
  forceLightMode?: boolean;
}>(({ isActive, forceLightMode }) => ({
  width: '32px',
  height: '32px',
  flex: '0 0 32px',
  borderRadius: '32px',
  background: forceLightMode
    ? 'var(--ion-popup-initial-icon-color)'
    : 'var(--ion-initial-icon-color)',
  margin: '0px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'inline-flex',
  color: 'var(--ion-color-white)',
  fontSize: '12px',
  fontWeight: '700',
  position: 'relative',
  ['&::after']: isActive && {
    border: '1px solid var(--ion-background-color)',
    borderRadius: '50%',
    bottom: 0,
    right: 0,
    content: '""',
    position: 'absolute',
    background: 'var(--ion-color-success)',
    width: 8,
    height: 8,
  },
}));

export const AccountIcon = ({
  ledgerId,
  isActive = false,
  forceLightMode = false,
  onClick,
}: {
  ledgerId?: string;
  isActive?: boolean;
  forceLightMode?: boolean;
  onClick?: () => void;
}) => {
  const [nftUrl, setNftUrl] = useState('');

  useEffect(() => {
    async function getNft() {
      if (ledgerId) {
        const nftUrl = await getNftImage(ledgerId, '32');
        setNftUrl(nftUrl);
      }
    }
    getNft();
  }, []);

  return (
    <>
      {ledgerId && <StyledNftImage src={nftUrl} onClick={onClick} />}
      {!ledgerId && (
        <StyledInitialIcon
          isActive={isActive}
          forceLightMode={forceLightMode}
          onClick={onClick}
        >
          AS
        </StyledInitialIcon>
      )}
    </>
  );
};
