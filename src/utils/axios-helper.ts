import axios from 'axios';

import { akashicPayRoot } from '../routing/navigation-tree';
import { lastPageStorage, NavigationPriority } from './last-page-storage';

const AppConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
};

/** For requests that don't need cookies */
export const axiosBasePublic = axios.create({
  baseURL: AppConfig.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/** For requests that need cookies */
export const axiosOwnerBase = axios.create({
  withCredentials: true,
  baseURL: AppConfig.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Any request that 401s (auth cookie expired or not set) should chuck user
 * out to the landing page screen, unless the current page has an IMMEDIATE navigation priority
 */
axiosOwnerBase.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (401 === error.response.status) {
      // Skip if already on landing page
      if (window.location.href === `${window.location.origin}${akashicPayRoot}`)
        return;

      // Get the current page user in on from memory
      lastPageStorage.get().then((currentPage) => {
        // If current page is undefined, or required authentication, kick user to the landing page
        if (
          !currentPage ||
          currentPage.navigationPriority ===
            NavigationPriority.AWAIT_AUTHENTICATION
        ) {
          window.location.href = `${window.location.origin}/index.html`;
        }
      });
    } else {
      return Promise.reject(error);
    }
  }
);
