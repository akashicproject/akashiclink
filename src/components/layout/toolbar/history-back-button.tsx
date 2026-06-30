import styled from '@emotion/styled';
import { IonButton, IonIcon } from '@ionic/react';

import { type Url, urls } from '../../../constants/urls';
import { historyGoBackOrReplace } from '../../../routing/history';

const BackButton = styled(IonButton)({
  marginLeft: -8,
  width: '32px',
  height: '32px',
  '--padding-start': 0,
  '--padding-end': 0,
});

export const HistoryBackButton = ({
  backButtonReplaceTarget = urls.dashboard,
}: {
  backButtonReplaceTarget?: Url;
}) => {
  const onClickBackButton = () => {
    historyGoBackOrReplace(backButtonReplaceTarget);
  };

  return (
    <BackButton size="small" fill="clear" onClick={onClickBackButton}>
      <IonIcon slot="icon-only" src={`/assets/images/arrow-back.svg`} />
    </BackButton>
  );
};
