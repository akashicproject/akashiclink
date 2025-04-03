import type { History } from 'history';

import { urls } from '../constants/urls';
import { akashicPayPath } from './navigation-tabs';

/**
 * Attempt to back to the previous page, with custom logic to
 * handle case when chrome extension was closed and reopened
 * (which invalidates history stack)
 *
 * @param history which you get with useHistory
 * @param loggedOut state at the start of the redirect
 */
export function historyGoBack(history: History, loggedOut?: boolean) {
  // We use `state` as a flag to indicate that
  // the page was arrived at without closing the extension
  if (history.location.state) history.goBack();
  else {
    // Otherwise redirect to dashboard to login page, depending on logged in state
    if (loggedOut) history.push(akashicPayPath(urls.akashicPay));
    else history.push(akashicPayPath(urls.dashboard));
  }
}
