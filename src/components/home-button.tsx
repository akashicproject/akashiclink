import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { urls } from '../constants/urls';
import { akashicPayPath } from '../routing/navigation-tabs';
import { WhiteButton } from './buttons';

/**
 * Button that redirects user to the logged in dashboard
 */
export function HomeButton() {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <WhiteButton
      onClick={() => history.push(akashicPayPath(urls.loggedFunction))}
    >
      {t('GoBack')}
    </WhiteButton>
  );
}
