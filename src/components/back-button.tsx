import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { WhiteButton } from './buttons';

/**
 * Button that redirects user to previous page
 */
export function BackButton() {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <WhiteButton onClick={() => history.goBack()}>{t('GoBack')}</WhiteButton>
  );
}
