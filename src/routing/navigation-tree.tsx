import { IonLabel, IonRouterOutlet, IonTabButton } from '@ionic/react';
import { Redirect, Route } from 'react-router';

import { urls } from '../constants/urls';
import { Activity } from '../pages/activity';
import { BeforeCreateWallet } from '../pages/createWallet/before-create-wallet';
import { CreateWallet } from '../pages/createWallet/create-wallet';
import { CreatingWallet } from '../pages/createWallet/creating-wallet';
import { WalletCreated } from '../pages/createWallet/wallet-created';
import { ErrorPage } from '../pages/error';
import { HeliumPayDashboard } from '../pages/hp-dashboard';
import { HeliumPayMain } from '../pages/hp-main';
import { ImportWallet } from '../pages/import-wallet';
import { LoggedCreate } from '../pages/logged/logged-create';
import { LoggedDeposit } from '../pages/logged/logged-deposit';
import { LoggedFunction } from '../pages/logged/logged-function';
import { Login } from '../pages/login';
import { Recover } from '../pages/recover';
import { RecoverCode } from '../pages/recover-code';
import { Recovery } from '../pages/Recovery/recovery';
import { ResetPassword } from '../pages/Recovery/reset-password';
import { Verification } from '../pages/Recovery/verification';
import { SendConfirm } from '../pages/send/send-confirm';
import { SendResult } from '../pages/send/send-result';
import { SendTo } from '../pages/send/send-to';
import { Settings } from '../pages/settings';
import { SettingsBackup } from '../pages/settings-backup';
import { SettingsInfo } from '../pages/settings-info';
import { SettingsLanguage } from '../pages/settings-language';
import { SettingsNaming } from '../pages/settings-naming';
import { SettingsVersion } from '../pages/settings-version';
import { Us2Main } from '../pages/us2-main';
import { Welcome } from '../pages/welcome';

/**
 * Tabs will be used to split the wallet up in 2+ parallel and non-interacting trees:
 * - Each tree belong will be associated with a single tab.
 * - Each tree will have it's own navigation stack - switching trees preserves the navigation state
 * - Pages (aka views) are registered under a tree through a urls of the form /:tab(subtreeName)/path-to-page
 * - Using this factory function should prevent cross-tab navigation which is not allowed e.g. from /us2/xxx page to /hp/yyy page.
 *
 * @returns root path
 * @returns registerPage function that links a page to a this tabs navigation tree
 * @returns createPath function that creates a valid path in this subtree
 * @returns tab JSX.Element that should be placed inside a <IonTabBar>
 */
export function createNavigationSubtree(
  subtreeName: string,
  subtreeLabel: string
) {
  const root = `/${subtreeName}`;
  return {
    root,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerPage: (page: (...args: any[]) => JSX.Element, url?: string) => (
      <Route
        exact
        path={url ? `/:tab(${subtreeName})/${url}` : `/:tab(${subtreeName})`}
        component={page}
      />
    ),
    createPath: (url: string, params?: Record<string, string>) => {
      let base = `${root}/${url}`;
      params &&
        Object.entries(params).forEach((value) => {
          base = base.replace(`:${value[0]}`, value[1]);
        });
      return base;
    },
    tab: (
      <IonTabButton tab={subtreeName} href={root}>
        <IonLabel>{subtreeLabel}</IonLabel>
      </IonTabButton>
    ),
  };
}

const hpSubtree = createNavigationSubtree(urls.heliumPay, 'HeliumPay Chain');
export const { createPath: heliumPayPath } = hpSubtree;

const us2Subtree = createNavigationSubtree(urls.us2, 'Square (US²)');
export const { createPath: us2Path } = us2Subtree;

/**
 * Definition of all the routing in the app
 */
export function NavigationTree() {
  return (
    <IonRouterOutlet>
      {/* HeliumPay tree - default so redirect at bottom */}
      {hpSubtree.registerPage(HeliumPayMain)}
      {hpSubtree.registerPage(BeforeCreateWallet, urls.beforeCreateWallet)}
      {hpSubtree.registerPage(CreateWallet, urls.createWallet)}
      {hpSubtree.registerPage(CreatingWallet, urls.creatingWallet)}
      {hpSubtree.registerPage(WalletCreated, urls.walletCreated)}
      {hpSubtree.registerPage(Recovery, urls.recovery)}
      {hpSubtree.registerPage(ResetPassword, urls.resetPassword)}
      {hpSubtree.registerPage(Verification, urls.verification)}
      {hpSubtree.registerPage(Login, urls.login)}
      {hpSubtree.registerPage(ImportWallet, urls.import)}
      {hpSubtree.registerPage(Welcome, urls.welcome)}
      {hpSubtree.registerPage(LoggedFunction, urls.loggedFunction)}
      {hpSubtree.registerPage(LoggedCreate, urls.loggedCreate)}
      {hpSubtree.registerPage(LoggedDeposit, urls.loggedDeposit)}
      {hpSubtree.registerPage(SendConfirm, urls.sendConfirm)}
      {hpSubtree.registerPage(SendTo, urls.sendTo)}
      {hpSubtree.registerPage(SendResult, urls.sendResult)}
      {hpSubtree.registerPage(Activity, urls.activity)}
      {hpSubtree.registerPage(Recover, urls.recover)}
      {hpSubtree.registerPage(HeliumPayDashboard, urls.dashboard)}
      {hpSubtree.registerPage(Settings, urls.settings)}
      {hpSubtree.registerPage(RecoverCode, urls.recoverCode)}
      {hpSubtree.registerPage(SettingsLanguage, urls.settingsLanguage)}
      {hpSubtree.registerPage(SettingsBackup, urls.settingsBackup)}
      {hpSubtree.registerPage(SettingsNaming, urls.settingsNaming)}
      {hpSubtree.registerPage(SettingsVersion, urls.settingsVersion)}
      {hpSubtree.registerPage(SettingsInfo, urls.settingsInfo)}
      {hpSubtree.registerPage(ErrorPage, urls.error)}

      {/* US² tree */}
      {us2Subtree.registerPage(Us2Main)}

      {/* Default redirect */}
      <Redirect to={hpSubtree.root} />
    </IonRouterOutlet>
  );
}
