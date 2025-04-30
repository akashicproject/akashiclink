import styled from '@emotion/styled';
import { IonButton, IonIcon } from '@ionic/react';

import { type Url, urls } from '../../../constants/urls';
import { historyGoBackOrReplace } from '../../../routing/history';

const BackButton = styled(IonButton)({
  marginLeft: -8,
  width: 32,
  height: 32,
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
      <IonIcon slot="icon-only" src={`/shared-assets/images/arrow-back.svg`} />
    </BackButton>
  );
};
